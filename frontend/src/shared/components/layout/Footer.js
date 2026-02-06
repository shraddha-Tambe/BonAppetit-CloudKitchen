import { Link } from 'react-router-dom';
import { ChefHat, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
export const Footer = () => {
    return (<footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary-foreground"/>
              </div>
              <span className="text-xl font-bold">
                Bon<span className="text-primary">Appetit</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm">
              Your one-stop platform for delicious food from the best restaurants in town. 
              Order now and taste the difference!
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61587034557119" className="text-background/60 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5"/>
              </a>
              <a href="https://x.com/_bon_appetit___" className="text-background/60 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5"/>
              </a>
              <a href="https://www.instagram.com/bon_appetit_cloudkitchen?igsh=NGt3Zm5kMmw2NXFz" className="text-background/60 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href="www.linkedin.com/in/bon-appetit--" className="text-background/60 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5"/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/ngo" className="text-background/70 hover:text-primary transition-colors text-sm">
                  NGO Partners
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Register Your Restaurant
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Partners</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Join as Restaurant
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Become a Delivery Partner
                </Link>
              </li>
              <li>
                <Link to="/ngo" className="text-background/70 hover:text-primary transition-colors text-sm">
                  NGO Partnership
                </Link>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Partner Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0"/>
                123 Food Street, Nashik District, Nashik 
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4 text-primary flex-shrink-0"/>
                +91 7709232088
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="w-4 h-4 text-primary flex-shrink-0"/>
                cloudKitchen@kitchen.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} BonAppetit. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>);
};
