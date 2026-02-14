import { useState, useEffect } from 'react';
import { Heart, DollarSign, Package, MapPin, History } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { NGOCard } from '@/shared/components/cards/NGOCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/shared/components/ui/dialog';
import API from '@/services/api';
const NGOPage = () => {
  const { currentUser, moneyDonations, foodDonations } = useApp();
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [approvedNGOs, setApprovedNGOs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Approved NGOs from Backend
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await API.get('/ngos');
        if (res.data) {
          setApprovedNGOs(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch NGOs", error);
        toast({ title: 'Error', description: 'Failed to load NGOs', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchNGOs();
  }, []);

  const handleDonate = (ngo) => {
    setSelectedNGO(ngo);
    setIsDonateOpen(true);
  };

  const availableFoodDonations = foodDonations.filter(d => d.status === 'AVAILABLE');
  const userDonations = currentUser ? moneyDonations.filter(d => d.userId === currentUser.id) : [];
  const handleSubmitDonation = async () => {
    if (!currentUser) {
      toast({ title: 'Please login', description: 'You need to login to make a donation.', variant: 'destructive' });
      return;
    }
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid donation amount.', variant: 'destructive' });
      return;
    }
    if (!selectedNGO) return;

    try {
      await API.post('/donations/money', {
        ngoId: selectedNGO.id,
        amount
      });
      toast({
        title: 'Thank you for your donation!',
        description: `You donated ₹${amount} to ${selectedNGO.name}`,
      });
      setIsDonateOpen(false);
      setDonationAmount('');
      setSelectedNGO(null);
      // Refresh history?
    } catch (error) {
      toast({ title: 'Error', description: 'Donation failed', variant: 'destructive' });
    }
  };

  // Remove handleClaimFood as it's now in NGO Dashboard for NGOs.
  // Or keep it for "Customer view" if an NGO is browsing? 
  // The instructions said "NGOs ... see dashboard... claim food".
  // Regular users can't claim.
  // I will remove claim logic from here or redirect.
  const handleClaimFood = () => {
    toast({ title: 'Redirecting', description: 'Please use NGO Dashboard to claim food.' });
  };
  return (<Layout>
    {/* Hero */}
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4 text-center">
        <Heart className="w-16 h-16 mx-auto text-secondary-foreground mb-6" />
        <h1 className="text-4xl font-bold text-secondary-foreground mb-4">
          NGO Partners
        </h1>
        <p className="text-secondary-foreground/80 max-w-2xl mx-auto">
          Support our partner NGOs working towards ending hunger.
          Your donations help feed those in need.
        </p>
      </div>
    </section>

    <div className="container mx-auto px-4 py-12">
      <Tabs defaultValue="ngos">
        <TabsList className="mb-8">
          <TabsTrigger value="ngos" className="gap-2">
            <Heart className="w-4 h-4" />
            NGO Partners
          </TabsTrigger>
          <TabsTrigger value="food" className="gap-2">
            <Package className="w-4 h-4" />
            Food Donations
          </TabsTrigger>
          {currentUser && (<TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            My Donations
          </TabsTrigger>)}
        </TabsList>

        {/* NGO List */}
        <TabsContent value="ngos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedNGOs.length > 0 ? (
              approvedNGOs.map((ngo, index) => (<div key={ngo.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <NGOCard ngo={ngo} onDonate={handleDonate} />
              </div>))
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No approved NGOs available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Food Donations */}
        <TabsContent value="food">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Available Food Donations
            </h2>

            {availableFoodDonations.length > 0 ? (<div className="grid gap-4">
              {availableFoodDonations.map((donation) => (<div key={donation.id} className="food-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {donation.restaurantName}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      <span className="font-medium">Items:</span> {donation.items}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Quantity:</span> {donation.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Listed: {new Date(donation.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Available
                    </Badge>
                    {currentUser?.role === 'ngo' && (<Button onClick={() => handleClaimFood(donation.id)}>
                      Claim Donation
                    </Button>)}
                  </div>
                </div>
              </div>))}
            </div>) : (<div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No food donations available at the moment.</p>
            </div>)}
          </div>
        </TabsContent>

        {/* Donation History */}
        <TabsContent value="history">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Your Donation History
            </h2>

            {userDonations.length > 0 ? (<div className="grid gap-4">
              {userDonations.map((donation) => (<div key={donation.id} className="food-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {donation.ngoName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{donation.amount}</p>
                    <Badge variant="outline" className="text-secondary border-secondary">
                      Completed
                    </Badge>
                  </div>
                </div>
              </div>))}
            </div>) : (<div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">You haven't made any donations yet.</p>
            </div>)}
          </div>
        </TabsContent>
      </Tabs>
    </div>

    {/* Donation Dialog */}
    <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Donate to {selectedNGO?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {selectedNGO?.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {selectedNGO?.city}
          </div>

          <div className="space-y-2">
            <Label>Donation Amount (₹)</Label>
            <Input type="number" min="1" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="Enter amount" />
          </div>

          <div className="flex gap-2">
            {[100, 500, 1000, 2000].map((amount) => (<Button key={amount} variant="outline" size="sm" onClick={() => setDonationAmount(amount.toString())}>
              ₹{amount}
            </Button>))}
          </div>

          <Button className="w-full btn-primary-gradient gap-2" onClick={handleSubmitDonation}>
            <Heart className="w-4 h-4" />
            Donate ₹{donationAmount || '0'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </Layout>);
};
export default NGOPage;
