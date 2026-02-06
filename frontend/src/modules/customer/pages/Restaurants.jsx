import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChefHat, Plus, Upload } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { RestaurantCard } from '@/shared/components/cards/RestaurantCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { toast } from '@/shared/hooks/use-toast';
import API from '@/services/api';

const cuisineFilters = ['All', 'Multi-Cuisine', 'North Indian', 'Chinese', 'Italian', 'South Indian', 'Fast Food'];

const Restaurants = () => {
  const { addRestaurant, register, getImageUrl } = useApp(); // Keep register for now as it handles user reg
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // ... form data state ...
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    cuisine: '',
    description: '',
    licenseNumber: '',
    image: '',
    imagePreview: null
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get('/restaurants');
        setRestaurants(res.data);
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // My Kitchen always first
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants; // API returns only approved ones
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => r.restaurantName.toLowerCase().includes(query) ||
        (r.cuisineType && r.cuisineType.toLowerCase().includes(query)));
    }
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(r => r.cuisineType === selectedCuisine); // Note: backend uses cuisineType
    }
    return filtered;
  }, [restaurants, searchQuery, selectedCuisine]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    // Register user with restaurant role
    const userResult = register({
      name: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      role: 'restaurant'
    });
    if (!userResult.success) {
      toast({
        title: 'Error',
        description: userResult.message,
        variant: 'destructive'
      });
      return;
    }
    // Add restaurant
    addRestaurant({
      name: formData.name,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      cuisine: formData.cuisine,
      description: formData.description,
      licenseNumber: formData.licenseNumber,
      image: formData.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
      menu: []
    });
    toast({
      title: 'Registration Successful!',
      description: 'Your restaurant has been registered. You can now manage it from your dashboard.',
    });
    setIsRegisterOpen(false);
    setFormData({
      name: '',
      ownerName: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      cuisine: '',
      description: '',
      licenseNumber: '',
      image: '',
      imagePreview: null
    });
  };
  return (<Layout>
    {/* Header */}
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Restaurants
            </h1>
            <p className="text-muted-foreground">
              Discover and order from the best restaurants in your area
            </p>
          </div>

          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary-gradient gap-2">
                <Plus className="w-4 h-4" />
                Register Your Restaurant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary" />
                  Register Your Restaurant
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input id="ownerName" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type *</Label>
                  <Input id="cuisine" value={formData.cuisine} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })} placeholder="e.g., North Indian, Chinese, Italian" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Restaurant License Number *</Label>
                  <Input id="licenseNumber" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="e.g., LIC-2024-001" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Restaurant Image</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    {formData.imagePreview && (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Upload a restaurant image (JPG, PNG, etc.)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Or provide Image URL</Label>
                  <Input id="imageUrl" type="url" value={formData.image && !formData.imagePreview ? formData.image : ''} onChange={(e) => !formData.imagePreview && setFormData({ ...formData, image: e.target.value })} placeholder="https://..." disabled={!!formData.imagePreview} />
                </div>

                <Button type="submit" className="w-full btn-primary-gradient">
                  Register Restaurant
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input type="text" placeholder="Search restaurants or cuisines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 text-lg" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {cuisineFilters.map((cuisine) => (<button key={cuisine} onClick={() => setSelectedCuisine(cuisine)} className={`category-pill whitespace-nowrap ${selectedCuisine === cuisine ? 'active' : ''}`}>
              {cuisine}
            </button>))}
          </div>
        </div>
      </div>
    </section>

    {/* Results */}
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading restaurants...</div>
        ) : (
          filteredRestaurants.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant, index) => (<div key={restaurant.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              {/* Note: RestaurantCard expects props. Ensure backend field names match or map them */}
              <RestaurantCard restaurant={{
                ...restaurant,
                name: restaurant.restaurantName, // Map backend 'restaurantName' to 'name'
                cuisine: restaurant.cuisineType, // Map 'cuisineType' to 'cuisine'
                image: getImageUrl(restaurant.imageUrl || restaurant.image) // Map 'imageUrl' to 'image', fallback
              }} />
            </div>))}
          </div>) : (<div className="text-center py-16">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No restaurants found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>)
        )}
      </div>
    </section>
  </Layout>);
};
export default Restaurants;
