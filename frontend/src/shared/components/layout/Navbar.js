import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { getToken, getRole, logout } from '@/utils/auth';
import API from "@/services/api"; // Added static import
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/shared/components/ui/dropdown-menu';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useApp();
  const location = useLocation();

  const [points, setPoints] = useState(0);

  const token = getToken();
  const role = getRole();
  const userId = localStorage.getItem('id');
  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn && userId) {
      API.get(`/users/${userId}`)
        .then(res => {
          setPoints(res.data.loyaltyPoints || 0);
        })
        .catch(err => console.error("Failed to fetch points", err));
    }
  }, [isLoggedIn, userId, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'NGOs', path: '/ngo' },
  ];
  const isActive = (path) => location.pathname === path;
  const getDashboardLink = () => {
    if (!isLoggedIn)
      return null;
    switch (role) {
      case 'RESTAURANT':
        return '/owner-dashboard';
      case 'DELIVERY':
        return '/delivery-dashboard';
      case 'ADMIN':
        return '/admin';
      case 'NGO':
        return '/ngo-dashboard';
      default:
        return null;
    }
  };
  return (<nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/logoImg.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Bon<span className="text-primary">Appetit</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/60" />
            <Input type="text" placeholder="Search restaurants, dishes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/80 border border-border/50 focus-visible:ring-primary text-foreground" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (<Link key={link.path} to={link.path} className={`nav-link font-medium ${isActive(link.path) ? 'active text-primary' : ''}`}>
            {link.name}
          </Link>))}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Loyalty Points Badge */}
              <div className="hidden lg:flex items-center gap-1 bg-amber-100/50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200">
                <span className="text-amber-500">★</span>
                <span>{points} Coins</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-24 truncate">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-muted-foreground text-xs">
                    {role}
                  </DropdownMenuItem>
                  {/* Mobile points in menu */}
                  <DropdownMenuItem className="lg:hidden text-amber-600 font-semibold">
                    ★ {points} Coins
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {getDashboardLink() && (<DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>Dashboard</Link>
                  </DropdownMenuItem>)}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (!isLoggedIn && <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="btn-primary-gradient">Register</Button>
            </Link>
          </div>)}

          {/* Cart Button - Only for customers */}
          {(!isLoggedIn || role === 'USER') && (
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (<span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-bounce-in">
                  {cartItemCount}
                </span>)}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {/* Cart Button - Only for customers */}
          {(!isLoggedIn || role === 'USER') && (
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (<span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>)}
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (<div className="md:hidden py-4 border-t border-border animate-fade-in">
        {/* Mobile Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/60" />
          <Input type="text" placeholder="Search restaurants, dishes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/80 border border-border/50 text-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (<Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={`px-4 py-2 rounded-lg transition-colors ${isActive(link.path)
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted'}`}>
            {link.name}
          </Link>))}

          {isLoggedIn ? (<>
            {getDashboardLink() && (<Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-muted">
              Dashboard
            </Link>)}
            <button onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }} className="px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-left">
              Logout
            </button>
          </>) : (!isLoggedIn && <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-muted">
              Login
            </Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
              Register
            </Link>
          </>)}
        </div>
      </div>)}
    </div>
  </nav>);
};

