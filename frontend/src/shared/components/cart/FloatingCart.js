import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Button } from '@/shared/components/ui/button';
export const FloatingCart = () => {
    const { cart, getCartTotal } = useApp();
    const location = useLocation();
    // Don't show on cart page
    if (location.pathname === '/cart' || cart.length === 0) {
        return null;
    }
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const { total } = getCartTotal();
    return (<div className="floating-cart">
      <Link to="/cart">
        <Button className="btn-primary-gradient h-14 px-6 rounded-full shadow-glow gap-3">
          <div className="relative">
            <ShoppingCart className="w-5 h-5"/>
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs opacity-100">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
            <p className="font-bold">₹{total.toFixed(0)}</p>
          </div>
        </Button>
      </Link>
    </div>);
};
