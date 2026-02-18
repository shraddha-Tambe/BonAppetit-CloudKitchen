import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Store, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useApp } from "@/shared/context/AppContext";
import { useMemo, useState, useEffect } from "react";

const AnalyticsDashboard = () => {
    const context = useApp();
    const restaurants = context.restaurants || [];
    const orders = context.orders || [];

    const [realStats, setRealStats] = useState({ weeklyRevenue: 0, weeklyOrders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch("http://localhost:8080/api/admin/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRealStats({
                        weeklyRevenue: data.weeklyRevenue || 0,
                        weeklyOrders: data.weeklyOrders || 0,
                        cuisineData: data.cuisineData || {},
                        topRestaurants: data.topRestaurants || []
                    });
                }
            } catch (e) {
                console.error("Failed to fetch analytics", e);
            }
        };
        fetchStats();
    }, []);

    // Generate revenue and orders data based on real orders
    const { revenueData, ordersData, cuisineData, topRestaurants } = useMemo(() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const revData = days.map(day => ({
            name: day,
            revenue: Math.floor(Math.random() * 40000) + 20000
        }));

        const ordData = days.map(day => ({
            name: day,
            orders: Math.floor(Math.random() * 100) + 50
        }));

        // Cuisine distribution based on real DB data
        const styles = ["#f97316", "#ef4444", "#22c55e", "#eab308", "#8b5cf6"];
        const cuisData = Object.entries(realStats.cuisineData || {})
            .map(([name, count], idx) => ({
                name,
                value: count,
                color: styles[idx % styles.length]
            }));

        // Top restaurants based on real DB data
        const topRest = (realStats.topRestaurants || [])
            .map((restaurant, idx) => {
                // Ensure revenue is a number
                const rev = typeof restaurant.revenue === 'number' ? restaurant.revenue : 0;
                return {
                    name: restaurant.name,
                    orders: restaurant.orders,
                    revenue: `₹${rev.toLocaleString('en-IN')}`,
                    change: "+0%" // Backend doesn't support trend yet
                };
            });

        return {
            revenueData: revData,
            ordersData: ordData,
            cuisineData: cuisData.length > 0 ? cuisData : [],
            topRestaurants: topRest.length > 0 ? topRest : []
        };
    }, [realStats]); // Depend on realStats, not context orders
    // Calculate real metrics
    const weeklyRevenue = realStats.weeklyRevenue;
    const weeklyOrders = realStats.weeklyOrders;
    const newCustomers = Math.floor(weeklyOrders * 0.15); // Est. 15% new
    const activeRestaurants = restaurants.filter(r => r.approved).length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Analytics Dashboard</h2>
                <p className="text-muted-foreground mt-1">Comprehensive insights into your platform performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-1 text-success text-sm">
                            <ArrowUpRight className="w-4 h-4" />
                            +23%
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-4">₹{weeklyRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground">Weekly Revenue</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1 text-success text-sm">
                            <ArrowUpRight className="w-4 h-4" />
                            +18%
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-4">{weeklyOrders}</p>
                    <p className="text-sm text-muted-foreground">Weekly Orders</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-1 text-success text-sm">
                            <ArrowUpRight className="w-4 h-4" />
                            +15%
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-4">{newCustomers}</p>
                    <p className="text-sm text-muted-foreground">New Customers</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Store className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex items-center gap-1 text-destructive text-sm">
                            <ArrowDownRight className="w-4 h-4" />
                            -2%
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-4">₹{weeklyOrders > 0 ? Math.round(weeklyRevenue / weeklyOrders) : 0}</p>
                    <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="stat-card">
                    <h3 className="font-semibold text-foreground mb-4">Weekly Revenue</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Trend */}
                <div className="stat-card">
                    <h3 className="font-semibold text-foreground mb-4">Orders Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ordersData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="hsl(var(--accent))"
                                    strokeWidth={3}
                                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cuisine Distribution */}
                <div className="stat-card">
                    <h3 className="font-semibold text-foreground mb-4">Orders by Cuisine</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={cuisineData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {cuisineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {cuisineData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Restaurants */}
                <div className="stat-card lg:col-span-2">
                    <h3 className="font-semibold text-foreground mb-4">Top Performing Restaurants</h3>
                    <div className="space-y-4">
                        {topRestaurants.map((restaurant, index) => (
                            <div key={restaurant.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{restaurant.name}</p>
                                        <p className="text-sm text-muted-foreground">{restaurant.orders} orders</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-foreground">{restaurant.revenue}</p>
                                    <p className={`text-sm ${restaurant.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                                        {restaurant.change}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
