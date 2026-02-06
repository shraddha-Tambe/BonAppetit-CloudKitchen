import { Users, Store, Truck, ShoppingBag, TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { useApp } from "@/shared/context/AppContext";
import { useMemo, useState, useEffect } from "react";

const DashboardOverview = () => {
    const context = useApp();
    const users = context.users || [];
    const restaurants = context.restaurants || [];
    const deliveryBoys = context.deliveryBoys || [];
    const orders = context.orders || [];

    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats
                const token = localStorage.getItem('token');
                const headers = { "Authorization": `Bearer ${token}` };
                
                const statsResponse = await fetch("http://localhost:8080/api/admin/stats", { headers });
                if (statsResponse.ok) {
                    const data = await statsResponse.json();
                    setStats([
                        {
                            label: "Total Customers",
                            value: String(data.totalCustomers || 0),
                            change: "+12%", // Mock change for now
                            trend: "up",
                            icon: Users,
                            color: "text-blue-600",
                            bgColor: "bg-blue-100",
                        },
                        {
                            label: "Active Restaurants",
                            value: String(data.activeRestaurants || 0),
                            change: "+8%",
                            trend: "up",
                            icon: Store,
                            color: "text-emerald-600",
                            bgColor: "bg-emerald-100",
                        },
                        {
                            label: "Delivery Partners",
                            value: String(data.activeDeliveryBoys || 0), // Use active ones
                            change: "+5%",
                            trend: "up",
                            icon: Truck,
                            color: "text-amber-600",
                            bgColor: "bg-amber-100",
                        },
                        {
                            label: "Total Orders",
                            value: String(data.totalOrders || 0),
                            change: "+18%",
                            trend: "up",
                            icon: ShoppingBag,
                            color: "text-purple-600",
                            bgColor: "bg-purple-100",
                        },
                    ]);
                }

                // Fetch Recent Orders
                const ordersResponse = await fetch("http://localhost:8080/api/admin/orders/recent", { headers });
                if (ordersResponse.ok) {
                    const data = await ordersResponse.json();
                    setRecentOrders(data.map(order => ({
                        id: `#ORD-${(order.id || '').toString().padStart(4, '0')}`,
                        customer: order.user ? order.user.name : "Unknown",
                        restaurant: order.restaurant ? order.restaurant.name : "Unknown",
                        amount: `₹${order.totalAmount || 0}`,
                        status: order.status || "Pending"
                    })));
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Calculate revenue metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const deliveryTime = 28; // Average in minutes
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Dashboard Overview</h2>
                <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="w-4 h-4 text-success" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-destructive" />
                                    )}
                                    <span className={stat.trend === "up" ? "text-success text-sm" : "text-destructive text-sm"}>
                                        {stat.change}
                                    </span>
                                    <span className="text-muted-foreground text-sm">vs last month</span>
                                </div>
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue & Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Card */}
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Total Revenue</h3>
                        <DollarSign className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-success text-sm">+23% from last period</span>
                    </div>
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "73%" }} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">73% of target achieved</p>
                </div>

                {/* Average Delivery Time */}
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Avg. Delivery Time</h3>
                        <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{deliveryTime} mins</p>
                    <div className="flex items-center gap-2 mt-2">
                        <TrendingDown className="w-4 h-4 text-success" />
                        <span className="text-success text-sm">-5 mins from last week</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-lg font-semibold text-foreground">22</p>
                            <p className="text-xs text-muted-foreground">Min (mins)</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">{deliveryTime}</p>
                            <p className="text-xs text-muted-foreground">Avg (mins)</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">45</p>
                            <p className="text-xs text-muted-foreground">Max (mins)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="stat-card">
                <h3 className="font-semibold text-foreground mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Restaurant</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="font-medium text-foreground">{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.restaurant}</td>
                                    <td className="font-medium text-foreground">{order.amount}</td>
                                    <td>
                                        <span
                                            className={`status-badge ${order.status === "Delivered"
                                                    ? "success"
                                                    : order.status === "In Transit"
                                                        ? "warning"
                                                        : "destructive"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
