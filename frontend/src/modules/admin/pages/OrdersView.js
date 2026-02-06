import { useState, useEffect } from "react";
import { Search, Eye, Filter, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import API from "@/services/api";

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [assigningOrder, setAssigningOrder] = useState(null); // Track which order is being assigned

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ordersRes, deliveryRes] = await Promise.all([
                    API.get("/admin/orders"),
                    API.get("/admin/delivery")
                ]);
                if (ordersRes.data) setOrders(ordersRes.data);
                if (deliveryRes.data) setDeliveryBoys(deliveryRes.data); // Assuming this returns all delivery boys (active/approved)
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (orderId, deliveryBoyId) => {
        try {
            await API.put(`/admin/orders/assign/${orderId}`, null, {
                params: { deliveryBoyId }
            });
            // Refresh orders locally
            const updatedOrders = orders.map(o => {
                if (o.id === orderId) {
                    const db = deliveryBoys.find(d => d.id === parseInt(deliveryBoyId));
                    return { ...o, deliveryBoy: db, status: 'out-for-delivery' };
                }
                return o;
            });
            setOrders(updatedOrders);
            setAssigningOrder(null);
            alert("Delivery Boy Assigned Successfully");
        } catch (error) {
            console.error("Assignment failed", error);
            alert(error.response?.data?.message || "Failed to assign");
        }
    };

    const filteredOrders = orders.filter((order) => {
        const id = String(order.id || '').toLowerCase();
        const customer = String(order.user?.fullName || order.userName || order.customer || '').toLowerCase();
        const restaurant = String(order.restaurant?.restaurantName || order.restaurantName || order.restaurant || '').toLowerCase();
        const matchesSearch =
            id.includes(searchTerm.toLowerCase()) ||
            customer.includes(searchTerm.toLowerCase()) ||
            restaurant.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "delivered":
                return <span className="status-badge success">Delivered</span>;
            case "in_transit":
            case "out-for-delivery":
                return <span className="status-badge warning">Out for Delivery</span>;
            case "preparing":
                return <span className="status-badge bg-blue-100 text-blue-600">Preparing</span>;
            case "pending":
                return <span className="status-badge bg-gray-100 text-gray-600">Pending</span>;
            case "cancelled":
                return <span className="status-badge destructive">Cancelled</span>;
            case "ready":
                return <span className="status-badge bg-green-100 text-green-800">Ready</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">All Orders</h2>
                    <p className="text-muted-foreground mt-1">View and track all orders across the platform</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
                {["all", "pending", "preparing", "ready", "out-for-delivery", "delivered", "cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        {status === "all" ? "All Orders" : status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="stat-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Restaurant</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Delivery Partner</th>
                                <th>Time</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="font-medium text-foreground">{order.id}</td>
                                    <td>
                                        <div>
                                            <p className="font-medium text-foreground">{order.user?.fullName || order.userName || order.customer || 'Unknown'}</p>
                                            <p className="text-xs text-muted-foreground">{order.user?.phone || order.userPhone || order.customerPhone || ''}</p>
                                        </div>
                                    </td>
                                    <td>{order.restaurant?.restaurantName || order.restaurantName || order.restaurant || 'Unknown'}</td>
                                    <td>
                                        <div className="max-w-[200px]">
                                            <p className="truncate text-sm">{(order.items || []).map(i => i.menuItem?.name || i.name || 'Item').join(", ")}</p>
                                        </div>
                                    </td>
                                    <td className="font-medium text-foreground">₹{(order.totalAmount || order.total || 0).toFixed(0)}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>{order.deliveryBoy?.fullName || order.deliveryBoyName || (order.deliveryBoy ? (typeof order.deliveryBoy === 'string' ? order.deliveryBoy : order.deliveryBoy.fullName) : '-')}</td>
                                    <td>
                                        <div className="text-xs">
                                            <p className="text-muted-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</p>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        {/* Assign Button Logic: Show if not delivered/cancelled/assigned */}
                                        {!order.deliveryBoy && !["delivered", "cancelled"].includes(order.status) ? (
                                            assigningOrder === order.id ? (
                                                <div className="flex gap-2 items-center justify-end">
                                                     <select 
                                                        className="text-xs p-1 border rounded"
                                                        onChange={(e) => {
                                                            if (e.target.value) handleAssign(order.id, e.target.value);
                                                        }}
                                                        defaultValue=""
                                                     >
                                                        <option value="" disabled>Select...</option>
                                                        {deliveryBoys.map(db => (
                                                            <option key={db.id} value={db.id}>{db.fullName || db.name || db.email}</option>
                                                        ))}
                                                     </select>
                                                     <Button variant="ghost" size="sm" onClick={() => setAssigningOrder(null)}>X</Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => setAssigningOrder(order.id)}>Assign</Button>
                                            )
                                        ) : (
                                            order.deliveryBoy ? <span className="text-xs text-green-600 font-medium">Assigned</span> : null
                                        )}
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-4 h-4" />
                                        </Button>
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

export default OrdersView;
