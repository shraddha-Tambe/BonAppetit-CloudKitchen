import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Crown, Search } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { MenuItemCard } from '@/shared/components/cards/MenuItemCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { toast } from '@/shared/hooks/use-toast';
import API from '@/services/api';


const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'starters', label: 'Starters' },
  { id: 'main', label: 'Main Course' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
];
const MenuPage = () => {
  const { id } = useParams();
  const { cart, getCartTotal } = useApp();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [resDetails, resMenu] = await Promise.all([
          API.get(`/restaurants/${id}`),
          API.get(`/menu/restaurant/${id}`)
        ]);

        // Map backend fields
        setRestaurant({
          ...resDetails.data,
          name: resDetails.data.restaurantName,
          cuisine: resDetails.data.cuisineType,
          image: resDetails.data.imageUrl || resDetails.data.image,
          rating: 4.5, // Mock rating
        });
        setMenu(resMenu.data);

      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load menu. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const filteredMenu = useMemo(() => {
    if (!restaurant)
      return [];
    let items = menu;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query));
    }
    if (vegOnly) {
      items = items.filter(item => item.isVeg);
    }
    if (activeCategory !== 'all') {
      // Note: DB MenuItem doesn't strictly have 'category' yet, so this might not work if API doesn't return it.
      // Assuming simplified view for now without category filter until backend supports it, 
      // OR we add category to MenuItemDTO/Entity.
      // For now, if activeCategory is not all, we might filter nothing or need to add it to backend.
      // Let's assume defaults unless backend has it. 
      // I'll skip category filtering if field missing, or check if 'category' exists in item.
      if (items[0]?.category) {
        items = items.filter(item => item.category === activeCategory);
      }
    }
    return items;
  }, [restaurant, menu, searchQuery, vegOnly, activeCategory]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { total } = getCartTotal();

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
  return (<Layout>
    {/* Header */}
    <section className="bg-muted/50 py-6 sticky top-16 z-40 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/restaurant/${restaurant.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {restaurant.isMyKitchen && (<Badge className="kitchen-badge gap-1 text-xs">
                <Crown className="w-3 h-3" />
                Featured
              </Badge>)}
              <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span>•</span>
              <span>{restaurant.cuisine}</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="text" placeholder="Search menu items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Button variant={vegOnly ? 'default' : 'outline'} onClick={() => setVegOnly(!vegOnly)} className={`gap-2 ${vegOnly ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}`}>
            <span className="w-3 h-3 rounded-sm border-2 border-current" />
            Veg Only
          </Button>
        </div>
      </div>
    </section>

    {/* Menu */}
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-8 flex-wrap h-auto gap-2 bg-transparent justify-start">
            {categories.map((cat) => (<TabsTrigger key={cat.id} value={cat.id} className="category-pill data-[state=active]:active">
              {cat.label}
            </TabsTrigger>))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {filteredMenu.length > 0 ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMenu.map((item, index) => (<div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <MenuItemCard item={item} restaurantId={restaurant.id} restaurantName={restaurant.name} />
              </div>))}
            </div>) : (<div className="text-center py-16">
              <p className="text-muted-foreground">No items found</p>
            </div>)}
          </TabsContent>
        </Tabs>
      </div>
    </section>

    {/* Cart Summary Bar */}
    {cartItemCount > 0 && (<div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
          <p className="text-lg font-bold text-foreground">₹{total.toFixed(0)}</p>
        </div>
        <Link to="/cart">
          <Button className="btn-primary-gradient">
            View Cart & Checkout
          </Button>
        </Link>
      </div>
    </div>)}
  </Layout>);
};
export default MenuPage;
