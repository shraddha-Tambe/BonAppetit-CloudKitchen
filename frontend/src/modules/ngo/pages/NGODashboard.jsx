import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, DollarSign, ArrowRight } from 'lucide-react';
import { Layout } from '@/shared/components/layout/Layout';
import { Button } from '@/shared/components/ui/button';
import { useApp } from '@/shared/context/AppContext';
import { toast } from '@/shared/hooks/use-toast';
import API from '@/services/api';

const NGODashboard = () => {
    const { currentUser } = useApp();
    const [stats, setStats] = useState({
        foodCount: 0,
        moneyTotal: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resFood, resMoney] = await Promise.all([
                    API.get('/donations/available'),
                    API.get('/donations/money')
                ]);

                const totalMoney = resMoney.data.reduce((sum, d) => sum + d.amount, 0);

                setStats({
                    foodCount: resFood.data.length,
                    moneyTotal: totalMoney
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
                toast({
                    title: 'Error',
                    description: 'Failed to load dashboard stats.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                        <Heart className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{currentUser?.name || 'NGO'} Dashboard</h1>
                        <p className="text-muted-foreground">Manage your impact</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="food-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Package className="w-5 h-5 text-amber-600" />
                            </div>
                            <Link to="/ngo/food">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.foodCount}</h3>
                        <p className="text-muted-foreground">Available Food Donations</p>
                        <Link to="/ngo/food">
                            <Button className="w-full mt-4 btn-primary-gradient">
                                Find Food
                            </Button>
                        </Link>
                    </div>

                    <div className="food-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <Link to="/ngo/money">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    History <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">₹{stats.moneyTotal.toFixed(0)}</h3>
                        <p className="text-muted-foreground">Total Funds Received</p>
                        <Link to="/ngo/money">
                            <Button variant="outline" className="w-full mt-4">
                                View History
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NGODashboard;
