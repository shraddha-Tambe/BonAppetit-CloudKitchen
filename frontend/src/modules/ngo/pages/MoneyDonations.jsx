import { useState, useEffect } from 'react';
import { DollarSign, Calendar, User } from 'lucide-react';
import { Layout } from '@/shared/components/layout/Layout';
import { Badge } from '@/shared/components/ui/badge';
import API from '@/services/api';

const MoneyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get('/donations/money');
                setDonations(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        Money Donations History
                    </h1>
                    <div className="bg-green-100 px-4 py-2 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">Total Received</p>
                        <p className="text-2xl font-bold text-green-700">₹{totalAmount.toFixed(2)}</p>
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : donations.length > 0 ? (
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div key={d.id} className="food-card p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{d.user?.name || 'Anonymous'}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-600">+₹{d.amount}</p>
                                    <Badge variant="outline" className="text-green-600 border-green-200">Received</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No money donations received yet.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MoneyDonations;
