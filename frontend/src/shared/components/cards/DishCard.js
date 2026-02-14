import { Star, Leaf, Plus } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/hooks/use-toast';
export const DishCard = ({ item, restaurantId, restaurantName }) => {
    const { addToCart, getImageUrl } = useApp();
    const handleAddToCart = () => {
        addToCart({
            menuItem: item,
            quantity: 1,
            restaurantId,
            restaurantName
        });
        toast({
            title: 'Added to cart!',
            description: `${item.name} has been added to your cart.`,
        });
    };
    return (<div className="food-card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={getImageUrl(item.image || item.imageUrl)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"; }}
        />
        <div className="overlay-gradient absolute inset-0 opacity-20"/>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isVeg && (<Badge variant="secondary" className="bg-secondary text-secondary-foreground gap-1">
              <Leaf className="w-3 h-3"/>
              Veg
            </Badge>)}
        </div>

        {/* Quick Add Button */}
        <Button size="icon" className="absolute bottom-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity btn-primary-gradient" onClick={handleAddToCart}>
          <Plus className="w-5 h-5"/>
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
          {item.rating && (<div className="flex items-center gap-1 text-sm flex-shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>
              <span>{item.rating}</span>
            </div>)}
        </div>
        <p className="text-sm text-foreground/70 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">₹{item.price}</span>
          <Button size="sm" variant="outline" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>);
};
