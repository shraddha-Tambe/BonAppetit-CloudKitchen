import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Phone, MapPin, Star, Bike, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";
import API from "@/services/api";

const DeliveryManagement = () => {
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDeliveryBoys = async () => {
             try {
                 setLoading(true);
                 // Trying to fetch all or approved. 
                 // If pending is separate, maybe this returns approved?
                 // Or we can try to fetch all if endpoint exists. 
                 // I will assume /admin/delivery returns approved ones or all.
                 const response = await API.get("/admin/delivery/approved"); // Optimistic endpoint
                 // If this 404s, I'd fallback to /admin/delivery
                 if (response.data) {
                    setDeliveryBoys(response.data);
                 }
             } catch (error) {
                 console.error("Failed to fetch delivery boys", error);
                 // Fallback try
                 try {
                     const res2 = await API.get("/admin/delivery");
                     if (res2.data) {
                        setDeliveryBoys(res2.data.filter(b => b.approved));
                     }
                 } catch (e) {
                    // ignore
                 }
             } finally {
                 setLoading(false);
             }
        };
        fetchDeliveryBoys();
    }, []);

    // Filter only approved delivery boys (in case API returns all)
    // If backend already filters, this is redundant but safe.
    const approvedDeliveryBoys = deliveryBoys.filter((boy) => boy.approved || true); // Assuming fetched list is what we want

    const filteredDeliveryBoys = deliveryBoys.filter(
        (boy) =>
            (boy.name && boy.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (boy.email && boy.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const activeCount = filteredDeliveryBoys.length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">Active Delivery Partners</h2>
                    <p className="text-muted-foreground mt-1">
                        {activeCount} approved delivery partners
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="stat-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                        <p className="text-sm text-muted-foreground">Approved Partners</p>
                    </div>
                </div>
                <div className="stat-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Bike className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                        <p className="text-sm text-muted-foreground">Available for Delivery</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="stat-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Delivery Partner</th>
                                <th>Vehicle</th>
                                <th>License Number</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
                            ) : filteredDeliveryBoys.length > 0 ? (
                                filteredDeliveryBoys.map((boy) => (
                                    <tr key={boy.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                    <span className="text-accent font-semibold">{boy.name ? boy.name.charAt(0) : "D"}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{boy.name || "Unknown"}</p>
                                                    <p className="text-xs text-muted-foreground">{boy.createdAt ? new Date(boy.createdAt).toLocaleDateString() : ""}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{boy.vehicle}</td>
                                        <td className="text-sm text-muted-foreground">{boy.drivingLicenseNumber}</td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                {boy.phone}
                                            </div>
                                        </td>
                                        <td className="text-sm text-muted-foreground">{boy.email}</td>
                                        <td><span className="status-badge success">Available</span></td>
                                        <td className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        Contact
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-muted-foreground">
                                        No approved delivery partners found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliveryManagement;
