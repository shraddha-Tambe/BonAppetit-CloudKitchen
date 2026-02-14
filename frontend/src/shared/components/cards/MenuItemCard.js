import { useState } from 'react';
import { Plus, Minus, Star, Leaf } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/hooks/use-toast';
export const MenuItemCard = ({ item, restaurantId, restaurantName }) => {
  const { addToCart, cart, updateCartQuantity } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const existingCartItem = cart.find(c => c.menuItem.id === item.id);
  const quantityInCart = existingCartItem?.quantity || 0;
  const handleAddToCart = () => {
    setIsAdding(true);
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
    setTimeout(() => setIsAdding(false), 300);
  };
  return (<div className="food-card flex flex-col md:flex-row">
    {/* Image */}
    <div className="relative w-full md:w-40 h-40 flex-shrink-0 overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      {item.isVeg && (<div className="absolute top-2 left-2">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground gap-1">
          <Leaf className="w-3 h-3" />
          Veg
        </Badge>
      </div>)}
    </div>

    {/* Content */}
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
          {item.rating && (<div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>)}
        </div>
        <p className="text-sm text-foreground/70 line-clamp-2 mb-3">
          {item.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-foreground">₹{item.price}</span>

        {quantityInCart > 0 ? (<div className="flex items-center gap-2 bg-primary/10 rounded-lg p-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
            updateCartQuantity(item.id, quantityInCart - 1);
          }}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-semibold w-8 text-center">{quantityInCart}</span>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddToCart}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>) : (<Button onClick={handleAddToCart} className={`gap-2 ${isAdding ? 'animate-scale-in' : ''}`}>
          <Plus className="w-4 h-4" />
          Add
        </Button>)}
      </div>
    </div>
  </div>);
};
