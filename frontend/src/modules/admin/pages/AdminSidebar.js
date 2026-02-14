import {
    LayoutDashboard,
    Users,
    Store,
    Truck,
    ShoppingBag,
    Heart,
    BarChart3,
    UtensilsCrossed,
    LogOut,
    ChefHat
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

const menuItems = [
    { id: "dashboard", path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { id: "customers", path: "/admin/customers", label: "Customers", icon: Users },
    { id: "restaurants", path: "/admin/restaurants", label: "Restaurants", icon: Store },
    { id: "delivery-approval", path: "/admin/delivery-approval", label: "Delivery Approval", icon: Truck },
    { id: "delivery", path: "/admin/delivery", label: "Delivery Boys", icon: Truck },
    { id: "orders", path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { id: "ngo", path: "/admin/ngo", label: "NGO Management", icon: Heart },
    { id: "analytics", path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { id: "dishes", path: "/admin/dishes", label: "Manage Dishes", icon: UtensilsCrossed },
];

const AdminSidebar = ({ activeSection, onLogout }) => {
    const handleLogoutClick = (e) => {
        e.preventDefault();
        if (onLogout && typeof onLogout === 'function') {
            onLogout();
        }
    };
    return (
        <aside className="admin-sidebar w-64 glass border-r border-white/10 h-full flex flex-col relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-40 bg-primary/10 blur-[50px] -z-10" />

            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-serif text-xl font-bold text-foreground">BonAppetit</h1>
                        <p className="text-xs text-muted-foreground">Admin Suite</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={cn(
                            "sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-white/5",
                            activeSection === item.id
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeSection === item.id ? "animate-bounce-in" : "")} />
                        <span className="font-medium">{item.label}</span>
                        {activeSection === item.id && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogoutClick}
                    className="sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
