import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Utensils, Crown, Heart } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { DishCard } from '@/shared/components/cards/DishCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { toast } from '@/shared/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import API from '@/services/api';

const RestaurantProfile = () => {
  const { id } = useParams();
  const { currentUser, addFoodDonation, ngos, getImageUrl } = useApp();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reviews Mock Data (Backlogged: Create Review Controller/Repo)
  const [reviews, setReviews] = useState([]);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [donationItems, setDonationItems] = useState('');
  const [donationQuantity, setDonationQuantity] = useState('');
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [resDetails, resMenu] = await Promise.all([
          API.get(`/restaurants/${id}`),
          API.get(`/menu/restaurant/${id}`)
        ]);

        // Map backend fields
        const isMyKitchen = resDetails.data.restaurantName === 'My Kitchen';
        setRestaurant({
          ...resDetails.data,
          name: resDetails.data.restaurantName,
          cuisine: resDetails.data.cuisineType,
          image: resDetails.data.imageUrl || resDetails.data.image,
          rating: 4.5, // Mock rating
          reviewCount: 24,
          // Inject My Kitchen specific details if applicable
          description: isMyKitchen
            ? 'A modern, functional kitchen by Sahil, Shashwat, Shraddha & Vaishnavi'
            : resDetails.data.description,
          phone: isMyKitchen ? '9999999999' : resDetails.data.phone,
          address: isMyKitchen ? 'Pune' : resDetails.data.address,
          isMyKitchen: isMyKitchen
        });
        setMenu(resMenu.data);
        // Mock reviews fetch
        // setReviews(resReviews.data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load restaurant details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (!restaurant) {
    return (<Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        {loading ? "Loading..." : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-4">Restaurant not found</h1>
            <Link to="/restaurants">
              <Button>Back to Restaurants</Button>
            </Link>
          </>
        )}
      </div>
    </Layout>);
  }
  const handleAddReview = () => {
    if (!currentUser) {
      toast({
        title: 'Please login',
        description: 'You need to login to add a review.',
        variant: 'destructive'
      });
      return;
    }
    if (!reviewText.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a review.',
        variant: 'destructive'
      });
      return;
    }
    // TODO: API call to add review
    toast({
      title: 'Review Added!',
      description: 'Thank you for your feedback.',
    });
    setReviewText('');
    setReviewRating(5);
  };
  const handleDonateFood = () => {
    if (!donationItems.trim() || !donationQuantity.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive'
      });
      return;
    }
    addFoodDonation({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: donationItems,
      quantity: donationQuantity,
      status: 'available'
    });
    toast({
      title: 'Food Donation Listed!',
      description: 'NGOs will be notified about your donation.',
    });
    setIsDonationOpen(false);
    setDonationItems('');
    setDonationQuantity('');
  };
  const isRestaurantOwner = currentUser?.role === 'restaurant' && currentUser?.email === restaurant.email;
  return (<Layout>
    {/* Hero Banner */}
    <section className="relative h-80 overflow-hidden">
      <img src={getImageUrl(restaurant.image)} alt={restaurant.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="container mx-auto">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {restaurant.isMyKitchen && (<Badge className="kitchen-badge gap-1">
                <Crown className="w-3 h-3" />
                Featured Kitchen
              </Badge>)}
              <h1 className="text-4xl font-bold text-background">{restaurant.name}</h1>
              <p className="text-background/80">{restaurant.cuisine}</p>

              <div className="flex items-center gap-4 text-background/80">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-background">{restaurant.rating}</span>
                  <span>({restaurant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>25-35 min</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isRestaurantOwner && (<Dialog open={isDonationOpen} onOpenChange={setIsDonationOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Donate Surplus Food
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Donate Leftover Food</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Food Items</Label>
                      <Input value={donationItems} onChange={(e) => setDonationItems(e.target.value)} placeholder="e.g., Rice, Curry, Bread" />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity (serves)</Label>
                      <Input value={donationQuantity} onChange={(e) => setDonationQuantity(e.target.value)} placeholder="e.g., 20 people" />
                    </div>
                    <Button onClick={handleDonateFood} className="w-full btn-primary-gradient">
                      List for Donation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>)}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Restaurant Info */}
    <section className="py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone}</span>
            </div>
          </div>

          <Link to={`/menu/${restaurant.id}`}>
            <Button size="lg" className="btn-primary-gradient gap-2">
              <Utensils className="w-5 h-5" />
              View Full Menu & Order
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-muted-foreground">{restaurant.description}</p>
      </div>
    </section>

    {/* Menu Preview */}
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Popular Dishes</h2>
          <Link to={`/menu/${restaurant.id}`}>
            <Button variant="outline">View Full Menu</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.slice(0, 4).map((item) => (<DishCard key={item.id} item={item} restaurantId={restaurant.id} restaurantName={restaurant.name} />))}
        </div>
      </div>
    </section>

    {/* Reviews */}
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-8">Reviews</h2>

        {/* Add Review */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
          <h3 className="font-semibold text-foreground mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                  <Star className={`w-8 h-8 transition-colors ${star <= reviewRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground/30'}`} />
                </button>))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Review</Label>
              <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." rows={3} />
            </div>
            <Button onClick={handleAddReview}>Submit Review</Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (reviews.map((review) => (<div key={review.id} className="bg-card rounded-xl p-6 shadow-soft">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-foreground">{review.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{review.rating}</span>
              </div>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>))) : (<p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review!
          </p>)}
        </div>
      </div>
    </section>
  </Layout>);
};
export default RestaurantProfile;
