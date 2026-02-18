import { MapPin, Mail, Phone, Heart } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
export const NGOCard = ({ ngo, onDonate }) => {
    const getTypeLabel = (type) => {
        const labels = {
            ashram: 'Ashram',
            trust: 'Trust',
            foundation: 'Foundation',
            other: 'Organization'
        };
        return labels[type] || type;
    };
    return (<div className="food-card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
        <div className="overlay-gradient absolute inset-0 opacity-40"/>
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-card/90 text-foreground">
            {getTypeLabel(ngo.type)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {ngo.name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0"/>
          <span>{ngo.city}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {ngo.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4"/>
            <span>{ngo.contact}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4"/>
            <span className="truncate">{ngo.email}</span>
          </div>
        </div>

        <Button className="w-full btn-primary-gradient gap-2" onClick={() => onDonate(ngo)}>
          <Heart className="w-4 h-4"/>
          Donate Now
        </Button>
      </div>
    </div>);
};
