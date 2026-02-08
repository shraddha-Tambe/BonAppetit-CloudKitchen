import { useState, useEffect } from 'react';
import API from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, MapPin, CreditCard, Smartphone, Heart } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from '@/shared/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/shared/components/ui/dialog';
const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, applyCoupon, currentUser, createOrder, getApprovedNGOs, getImageUrl } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState(''); // Store the actual applied coupon
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedNGO, setSelectedNGO] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll while checkout dialog is open to prevent scroll bleed
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [isCheckoutOpen]);

  const [points, setPoints] = useState(0);
  const [isPointsRedeemed, setIsPointsRedeemed] = useState(false);

  // Fetch approved NGOs and user points
  const approvedNGOs = getApprovedNGOs();

  useEffect(() => {
    if (currentUser?.id) {
      API.get(`/users/${currentUser.id}`)
        .then(res => setPoints(res.data.loyaltyPoints || 0))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  const [address, setAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const { subtotal, tax, deliveryCharge, total } = getCartTotal();
  const discountAmount = (subtotal * appliedDiscount) / 100;

  // Points Logic: 2 Points = ₹1 Discount (0.5 rate)
  const conversionRate = 0.5;
  const canRedeem = points >= 100;

  // Calculate max points we can use (limited by total bill and user balance)
  // We need (total - discountAmount) / conversionRate points to cover the whole bill
  const maxPointsForBill = (total - discountAmount) / conversionRate;
  const pointsToUse = isPointsRedeemed ? Math.min(points, Math.floor(maxPointsForBill)) : 0;

  const pointsDiscount = pointsToUse * conversionRate;

  const donation = parseFloat(donationAmount) || 0;
  const finalTotal = total - discountAmount - pointsDiscount + donation;

  // ... (inside handlePlaceOrder/processBackendOrders)



  // ... (UI Section)

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    if (result.valid) {
      setAppliedDiscount(result.discount);
      setAppliedCouponCode(couponCode); // Track valid coupon
      toast({
        title: 'Coupon Applied!',
        description: `You got ${result.discount}% off!`,
        variant: 'success'
      });
    }
    else {
      toast({
        title: 'Invalid Coupon',
        description: 'Please enter a valid coupon code.',
        variant: 'destructive'
      });
    }
  };
  const handleCheckout = () => {
    // Check both context and localStorage to be safe
    const token = localStorage.getItem('token');

    if (!currentUser && !token) {
      toast({
        title: 'Please login',
        description: 'You need to login to place an order.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }
    setIsCheckoutOpen(true);
  };
  // Razorpay Integration
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all delivery details.',
        variant: 'destructive'
      });
      return;
    }

    // New Validation: Ensure User ID is present
    if (!currentUser?.id) {
      toast({
        title: 'Session Expired',
        description: 'Please logout and login again to refresh your session.',
        variant: 'destructive'
      });
      return;
    }

    // Validate donation
    if (donation < 0) {
      toast({
        title: 'Invalid Donation',
        description: 'Donation amount cannot be negative.',
        variant: 'destructive'
      });
      return;
    }

    // If donation > 0, NGO selection is mandatory
    if (donation > 0 && !selectedNGO) {
      toast({
        title: 'NGO Required',
        description: 'Please select an NGO to donate to.',
        variant: 'destructive'
      });
      return;
    }

    const processBackendOrders = async (paymentId = null) => {
      // Group items by restaurant
      const restaurantGroups = cart.reduce((groups, item) => {
        if (!groups[item.restaurantId]) {
          groups[item.restaurantId] = {
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            items: []
          };
        }
        groups[item.restaurantId].items.push(item);
        return groups;
      }, {});

      // Create order for each restaurant
      try {
        await Promise.all(Object.values(restaurantGroups).map(async (group) => {
          const groupSubtotal = group.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
          const groupTax = groupSubtotal * 0.05;
          const groupDiscount = (groupSubtotal * appliedDiscount) / 100;
          const selectedNGOObj = selectedNGO ? approvedNGOs.find(ngo => ngo.id === selectedNGO) : null;

          const validRestaurantId = isNaN(group.restaurantId) ? 12 : parseInt(group.restaurantId);

          const orderData = {
            userId: parseInt(currentUser?.id || localStorage.getItem('id')),
            restaurantId: validRestaurantId,
            items: group.items.map(item => ({
              menuItemId: item.menuItem.id,
              quantity: item.quantity
            })),
            userAddress: address,
            userPhone: phone,
            subtotal: groupSubtotal,
            tax: groupTax,
            deliveryCharge: 40,
            discount: groupDiscount,
            donationAmount: donation,
            ngoId: selectedNGOObj?.id || null,
            total: groupSubtotal + groupTax + 40 - groupDiscount + donation - pointsDiscount, // Adjust total
            redeemedPoints: pointsToUse,
            couponCode: appliedDiscount > 0 ? appliedCouponCode : null, // Send applied coupon
            paymentId: paymentId // Pass paymentId if available
          };

          console.log('Sending Order Data:', JSON.stringify(orderData, null, 2)); // Log order data for debugging

          await API.post('/orders/place', orderData);
        }));

        toast({
          title: 'Order Placed!',
          description: 'Your order has been placed successfully. Track it in your dashboard.',
          variant: 'success'
        });
        clearCart();
        setAppliedDiscount(0);
        setCouponCode('');
        setDonationAmount('');
        setSelectedNGO('');
        setIsCheckoutOpen(false);
        navigate('/');
      } catch (error) {
        console.error('Order Placement Error:', error);
        let errorMessage = 'There was an error placing your order in the backend.';

        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (typeof error.response.data === 'object') {
            errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast({
          title: 'Order Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    };

    // Razorpay Flow for Card/UPI
    if (paymentMethod === 'card' || paymentMethod === 'upi') {
      try {
        const res = await loadRazorpayScript();
        if (!res) {
          toast({ title: 'Razorpay SDK failed to load', variant: 'destructive' });
          return;
        }

        // 1. Create Order via .NET Microservice
        // NOTE: Ensure your .NET service handles CORS for this origin
        const response = await fetch('http://localhost:5000/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal })
        });

        if (!response.ok) throw new Error('Failed to create payment order');
        const data = await response.json();
        const { amount, orderId, keyId } = data;

        const options = {
          key: keyId,
          amount: amount.toString(),
          currency: 'INR',
          name: 'Kitchen Cloud',
          description: 'Food Order Payment',
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                })
              });

              const verifyData = await verifyResponse.json();
              if (verifyData.status === 'success') {
                // Payment Verified, Proceed to place order in Spring Boot
                await processBackendOrders(response.razorpay_payment_id);
              } else {
                toast({ title: 'Payment Verification Failed', variant: 'destructive' });
              }
            } catch (error) {
              toast({ title: 'Verification Error', description: error.message, variant: 'destructive' });
            }
          },
          prefill: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            contact: phone || '',
          },
          theme: { color: "#3399cc" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (error) {
        console.error("Payment Error:", error);
        toast({ title: 'Payment Initiation Failed', description: error.message, variant: 'destructive' });
      }
    } else {
      // Fallback for other methods (e.g. COD if implemented later)
      // For now, assume everything goes through Razorpay or just call processBackendOrders()
      await processBackendOrders();
    }
  };
  if (cart.length === 0) {
    return (<Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some delicious items to get started!</p>
        <Link to="/restaurants">
          <Button className="btn-primary-gradient">Browse Restaurants</Button>
        </Link>
      </div>
    </Layout>);
  }
  return (<Layout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (<div key={item.menuItem.id} className="food-card flex gap-4 p-4">
            <img
              src={getImageUrl(item.menuItem.image || item.menuItem.imageUrl)}
              alt={item.menuItem.name}
              className="w-24 h-24 rounded-lg object-cover"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"; }}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.menuItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.restaurantName}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeFromCart(item.menuItem.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-lg font-bold text-foreground">
                  ₹{(item.menuItem.price * item.quantity).toFixed(0)}
                </span>
              </div>
            </div>
          </div>))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="food-card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
            </div>

            {appliedDiscount > 0 && (<div className="bg-secondary/20 text-secondary-foreground rounded-lg p-3 mb-6">
              <p className="text-sm font-medium">🎉 Coupon applied: {appliedDiscount}% off!</p>
            </div>)}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{subtotal.toFixed(0)}</span>
              </div>
              {appliedDiscount > 0 && (<div className="flex justify-between text-secondary">
                <span>Discount ({appliedDiscount}%)</span>
                <span>-₹{discountAmount.toFixed(0)}</span>
              </div>)}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span className="text-foreground">₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-foreground">₹{deliveryCharge}</span>
              </div>
              {donation > 0 && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {selectedNGO && approvedNGOs.find(n => n.id === selectedNGO)
                      ? `Donation to ${approvedNGOs.find(n => n.id === selectedNGO)?.name}`
                      : 'Donation'
                    }
                  </span>
                  <span>+₹{donation.toFixed(0)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <Button className="w-full mt-6 btn-primary-gradient h-12 text-lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Try coupon: <span className="font-mono bg-muted px-1 rounded">WELCOME10</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Checkout Dialog */}
    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <DialogHeader>
          <DialogTitle>Delivery & Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Address */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Address
            </Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your complete address" rows={2} />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>

          {/* Points Redemption */}
          {points > 100 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Use Kitchen Coins
                    <span className="text-xs bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded">Balance: {points}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Redeem your coins for a discount. (1 Coin = ₹1)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="redeem-points"
                    checked={isPointsRedeemed}
                    onChange={(e) => setIsPointsRedeemed(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <Label htmlFor="redeem-points" className="font-medium cursor-pointer">
                    Redeem
                  </Label>
                </div>
              </div>
              {isPointsRedeemed && (
                <p className="text-sm font-medium text-amber-600 mt-2">
                  - ₹{pointsDiscount.toFixed(0)} will be deducted from your total.
                </p>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="w-4 h-4" />
                  UPI
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* NGO Donation Section */}
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Support a Cause
                    <span className="text-xs bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded">Optional</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Help us feed those in need. Your donation makes a difference.
                  </p>
                </div>
              </div>

              {/* Donation Amount */}
              <div className="space-y-2">
                <Label htmlFor="donation-amount">Donation Amount (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <Input
                    id="donation-amount"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={donationAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || parseFloat(value) >= 0) {
                        setDonationAmount(value);
                      }
                    }}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {donation > 0
                    ? `✓ Thank you for donating ₹${donation.toFixed(0)}!`
                    : 'Enter amount and select an NGO to donate'}
                </p>
              </div>

              {/* NGO Selection - Radio Cards */}
              {donation > 0 && (
                <div className="space-y-3">
                  <Label className={`block text-sm font-medium ${!selectedNGO ? 'text-destructive' : ''}`}>
                    Select an NGO {!selectedNGO && <span className="text-destructive">*</span>}
                  </Label>
                  <RadioGroup value={selectedNGO} onValueChange={setSelectedNGO}>
                    <div className="space-y-2">
                      {approvedNGOs.length > 0 ? (
                        approvedNGOs.map((ngo) => (
                          <div
                            key={ngo.id}
                            className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedNGO === ngo.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                              }`}
                          >
                            <RadioGroupItem value={ngo.id} id={ngo.id} className="mt-1" />
                            <Label htmlFor={ngo.id} className="flex-1 cursor-pointer">
                              <div className="flex items-start gap-3">
                                {ngo.image && (
                                  <img
                                    src={ngo.image}
                                    alt={ngo.name}
                                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{ngo.name}</p>
                                  {ngo.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                      {ngo.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No approved NGOs available</p>
                      )}
                    </div>
                  </RadioGroup>
                  {donation > 0 && !selectedNGO && (
                    <p className="text-xs text-destructive font-medium">Please select an NGO to proceed</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal + Tax + Delivery</span>
                <span className="text-foreground">₹{(subtotal + tax + deliveryCharge - discountAmount).toFixed(0)}</span>
              </div>
              {donation > 0 && (
                <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400 font-medium">
                  <span>Donation</span>
                  <span>+₹{donation.toFixed(0)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total to Pay</span>
                <span className="text-primary">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <Button className="w-full btn-primary-gradient h-12" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </Layout>);
};
export default Cart;
