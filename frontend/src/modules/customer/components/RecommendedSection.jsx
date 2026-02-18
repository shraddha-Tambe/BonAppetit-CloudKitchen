import React, { useEffect, useState } from 'react';
import { useApp } from '@/shared/context/AppContext';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { DishCard } from '@/shared/components/cards/DishCard';

const RecommendedSection = () => {
    const { currentUser, getRecommendations } = useApp();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            // Even if no user, we might want to show general recommendations (which the backend now supports via fallback)
            // But for now, let's keep the user check if we want, or try fetching anyway.
            // The backend logic falls back to global popular or random if user is null or new.
            // However, getRecommendations in AppContext currently expects a userId or returns empty.
            // Let's rely on currentUser.id for now to call the API.
            if (currentUser?.id) {
                const data = await getRecommendations(currentUser.id);
                // Map backend fields to frontend DishCard expectations
                const mappedData = data.map(item => ({
                    ...item,
                    image: item.imageUrl || item.image, // Handle both
                    restaurantId: item.restaurant?.id || 12, // Default to My Kitchen ID
                    restaurantName: item.restaurant?.name || 'Partner Kitchen'
                }));
                setRecommendations(mappedData);
            }
            setLoading(false);
        };
        fetchRecommendations();
    }, [currentUser, getRecommendations]);

    if (!currentUser) return null;
    if (loading) return null; // Silent loading
    if (recommendations.length === 0) return null;

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Badge className="kitchen-badge mb-2 gap-1">
                            <Sparkles className="w-3 h-3" />
                            For You
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground">
                            Recommended for You
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Curated dishes based on your taste
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map((item, index) => (
                        <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <DishCard
                                item={item}
                                restaurantId={item.restaurantId}
                                restaurantName={item.restaurantName}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommendedSection;
