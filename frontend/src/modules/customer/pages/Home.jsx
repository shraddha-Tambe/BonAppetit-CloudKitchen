import { Link } from 'react-router-dom';
import { ChefHat, Utensils, Heart, Truck, Star, ArrowRight, Crown, Clock, Flame } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { RestaurantCard } from '@/shared/components/cards/RestaurantCard';
import { DishCard } from '@/shared/components/cards/DishCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import RecommendedSection from '../components/RecommendedSection';
const Index = () => {
  const { restaurants } = useApp();
  // My Kitchen is always first
  const myKitchen = restaurants.find(r => r.isMyKitchen);
  const otherRestaurants = restaurants.filter(r => !r.isMyKitchen);
  const sortedRestaurants = myKitchen ? [myKitchen, ...otherRestaurants] : otherRestaurants;
  const featuredDishes = myKitchen?.menu.slice(0, 4) || [];
  return (<Layout>
    {/* Hero Section - My Kitchen Featured */}
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop" alt="Delicious food" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl space-y-6 animate-slide-up">
          <Badge className="kitchen-badge gap-2 text-base">
            <Crown className="w-4 h-4" />
            Featured Kitchen
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-background">
            Welcome to{' '}
            <span className="text-primary">My Kitchen</span>
          </h1>


          <p className="text-xl text-background/95 max-w-lg">
            Experience the finest homestyle cooking with restaurant-quality presentation.
            Fresh ingredients, authentic flavors, delivered to your doorstep.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to={myKitchen ? `/menu/${myKitchen.id}` : '/restaurants'}>
              <Button size="lg" className="btn-primary-gradient gap-2 text-lg h-14 px-8">
                <Utensils className="w-5 h-5" />
                Order Now
              </Button>
            </Link>
            <Link to="/restaurants">
              <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 bg-background/10 border-background/30 text-background hover:bg-background/20">
                Explore Restaurants
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            <div className="text-background">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-background/95">Average Rating</div>
            </div>
            <div className="text-background">
              <div className="text-3xl font-bold text-primary">248+</div>
              <div className="text-sm text-background/95">Happy Reviews</div>
            </div>
            <div className="text-background">
              <div className="text-3xl font-bold text-primary">30min</div>
              <div className="text-sm text-background/95">Fast Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Dishes from My Kitchen */}
    <section className="py-16 bg-kitchen-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="kitchen-badge mb-2">
              <Flame className="w-3 h-3" />
              Hot Picks
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Featured from My Kitchen
            </h2>
            <p className="text-muted-foreground mt-2">
              Our chef's most popular creations
            </p>
          </div>
          <Link to={myKitchen ? `/menu/${myKitchen.id}` : '/restaurants'}>
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish, index) => (<div key={dish.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <DishCard item={dish} restaurantId={myKitchen?.id || ''} restaurantName={myKitchen?.name || 'My Kitchen'} />
          </div>))}
        </div>
      </div>
    </section>

    {/* Recommended Section */}
    <RecommendedSection />


    {/* Quick Actions */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">
          What would you like to do?
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Order delicious food, support NGOs, or join our network as a partner
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link to="/restaurants" className="group">
            <div className="food-card p-6 text-center h-full">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Utensils className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Restaurants</h3>
              <p className="text-sm text-muted-foreground mt-1">Browse & Order</p>
            </div>
          </Link>

          <Link to="/ngo" className="group">
            <div className="food-card p-6 text-center h-full">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Heart className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">NGOs</h3>
              <p className="text-sm text-muted-foreground mt-1">Donate & Support</p>
            </div>
          </Link>

          <Link to="/register" className="group">
            <div className="food-card p-6 text-center h-full">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/30 flex items-center justify-center mb-4 group-hover:bg-accent/40 transition-colors">
                <ChefHat className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Register</h3>
              <p className="text-sm text-muted-foreground mt-1">Join as Partner</p>
            </div>
          </Link>

          <Link to="/register" className="group">
            <div className="food-card p-6 text-center h-full">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors">
                <Truck className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Delivery</h3>
              <p className="text-sm text-muted-foreground mt-1">Become a Partner</p>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* All Restaurants */}
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              All Restaurants
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover the best food near you
            </p>
          </div>
          <Link to="/restaurants">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedRestaurants.slice(0, 4).map((restaurant, index) => (<div key={restaurant.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <RestaurantCard restaurant={restaurant} />
          </div>))}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          Why Choose My Kitchen?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl hero-gradient flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-2">Expert Chefs</h3>
            <p className="text-muted-foreground">
              Our dishes are prepared by experienced chefs using traditional recipes and fresh ingredients.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">
              Get your food delivered hot and fresh within 30 minutes of ordering.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-2">Quality Guaranteed</h3>
            <p className="text-muted-foreground">
              We maintain the highest standards of hygiene and quality in every dish we serve.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-16 hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Ready to taste the difference?
        </h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
          Join thousands of food lovers who trust My Kitchen for their daily meals.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to={myKitchen ? `/menu/${myKitchen.id}` : '/restaurants'}>
            <Button size="lg" variant="secondary" className="gap-2">
              <Utensils className="w-5 h-5" />
              Order from My Kitchen
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Register Your Restaurant
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>);
};
export default Index;
