import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Crown, Phone } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useApp } from '@/shared/context/AppContext';
export const RestaurantCard = ({ restaurant }) => {
    const { getImageUrl } = useApp();
    return (<div className="food-card group relative">
      {/* My Kitchen Badge */}
      {restaurant.isMyKitchen && (<div className="absolute top-4 left-4 z-10">
          <Badge className="kitchen-badge gap-1">
            <Crown className="w-3 h-3"/>
            Featured
          </Badge>
        </div>)}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={getImageUrl(restaurant.image || restaurant.imageUrl)} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop"; }}
        />
        <div className="overlay-gradient absolute inset-0 opacity-20"/>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card px-2 py-1 rounded-full shadow-md">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>
          <span className="font-semibold text-sm">{restaurant.rating}</span>
          <span className="text-xs text-muted-foreground">({restaurant.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-foreground/70">{restaurant.cuisine}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <MapPin className="w-4 h-4 flex-shrink-0"/>
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>

        {restaurant.phone && (
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{restaurant.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <Clock className="w-4 h-4"/>
          <span>25-35 min</span>
        </div>

        <p className="text-sm text-foreground/70 line-clamp-2">
          {restaurant.description}
        </p>

        <Link to={`/restaurant/${restaurant.id}`}>
          <Button className={`w-full ${restaurant.isMyKitchen ? 'btn-primary-gradient' : ''}`} variant={restaurant.isMyKitchen ? 'default' : 'outline'}>
            View Menu
          </Button>
        </Link>
      </div>
    </div>);
};
