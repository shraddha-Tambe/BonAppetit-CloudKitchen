import { useState, useEffect } from 'react';
import { Package, Clock, MapPin, Check } from 'lucide-react';
import { Layout } from '@/shared/components/layout/Layout';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/hooks/use-toast';
import API from '@/services/api';

const AvailableFoodDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const res = await API.get('/donations/available');
            setDonations(res.data);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to fetch donations',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleClaim = async (id) => {
        try {
            await API.put(`/donations/claim/${id}`);
            toast({
                title: 'Success',
                description: 'Donation claimed successfully!',
            });
            fetchDonations();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to claim donation',
                variant: 'destructive',
            });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <Package className="w-8 h-8 text-primary" />
                    Available Food Donations
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : donations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donations.map((d) => (
                            <div key={d.id} className="food-card p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-lg">{d.restaurant?.restaurantName || 'Restaurant'}</h3>
                                    <Badge>Available</Badge>
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                    <p><span className="font-medium text-foreground">Items:</span> {d.items}</p>
                                    <p><span className="font-medium text-foreground">Quantity:</span> {d.quantity}</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(d.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{d.restaurant?.address || 'Address not available'}</span>
                                    </div>
                                </div>
                                <Button className="w-full btn-primary-gradient" onClick={() => handleClaim(d.id)}>
                                    Claim Donation
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No available food donations at the moment.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AvailableFoodDonations;
