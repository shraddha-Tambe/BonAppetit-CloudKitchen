import { useState, useEffect } from "react";
import { Search, Check, X, Trash2, MapPin, Phone, Mail, Calendar, Bike, Eye } from "lucide-react";
import API from "@/services/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { toast } from "sonner";

const DeliveryApproval = () => {
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);

    // Defined outside useEffect to be reusable
    const fetchDeliveryBoys = async () => {
        try {
            setLoading(true);
            // Try fetching pending first
            let all = [];
            try {
                const pendingRes = await API.get("/admin/delivery/pending");
                if (Array.isArray(pendingRes.data)) {
                    all = [...pendingRes.data];
                }
            } catch (e) { console.error("Pending fetch failed", e); }

            // Try fetching approved if endpoint exists
            try {
                const approvedRes = await API.get("/admin/delivery/approved");
                if (Array.isArray(approvedRes.data)) {
                    all = [...all, ...approvedRes.data];
                }
            } catch (e) { console.error("Approved fetch failed", e); }

            // Fallback
            if (all.length === 0) {
                try {
                    const res = await API.get("/admin/delivery");
                    if (Array.isArray(res.data)) all = res.data;
                } catch (e) { }
            }

            console.log("Fetched Delivery Boys:", all);
            setDeliveryBoys(all);
        } catch (error) {
            console.error("Failed to fetch delivery partners", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryBoys();
    }, []);

    const getStatus = (deliveryBoy) => {
        return deliveryBoy.approved ? "approved" : "pending";
    };

    const filteredDeliveryBoys = (Array.isArray(deliveryBoys) ? deliveryBoys : []).filter((deliveryBoy) => {
        const name = deliveryBoy.fullName || deliveryBoy.name || "";
        const email = deliveryBoy.email || "";

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());

        const status = getStatus(deliveryBoy);
        const matchesFilter = filter === "all" || status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleApprove = async (id, name) => {
        if (!id) {
            toast.error("Error: Invalid ID");
            return;
        }
        try {
            console.log("Approving:", id);
            await API.put(`/admin/approve/delivery/${id}`);
            toast.success(`${name} has been approved`);
            fetchDeliveryBoys();
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve delivery partner");
        }
    };

    const handleReject = async (id, name) => {
        if (!id) {
            toast.error("Error: Invalid ID");
            return;
        }
        try {
            console.log("Rejecting:", id);
            await API.put(`/admin/reject/delivery/${id}`);
            toast.success(`${name} has been rejected`);
            fetchDeliveryBoys();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject delivery partner");
        }
    };

    const handleRemove = async (id, name) => {
        await handleReject(id, name);
    };

    const pendingCount = deliveryBoys.filter((b) => !b.approved).length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">Delivery Partner Approval</h2>
                    <p className="text-muted-foreground mt-1">
                        {pendingCount} delivery partners pending approval
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search delivery partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {["all", "pending", "approved"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Delivery Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDeliveryBoys.map((deliveryBoy) => {
                    const status = getStatus(deliveryBoy);
                    return (
                        <div key={deliveryBoy.id} className="stat-card">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground">{deliveryBoy.fullName || deliveryBoy.name || "Unknown"}</h3>
                                    <p className="text-sm text-muted-foreground">{deliveryBoy.vehicleType || "N/A"}</p>
                                </div>
                                <span
                                    className={`status-badge ${status === "approved"
                                        ? "success"
                                        : "warning"
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {deliveryBoy.email || "No Email"}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {deliveryBoy.phone || "No Phone"}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Bike className="w-4 h-4" />
                                    {deliveryBoy.vehicleType || "N/A"} - {deliveryBoy.drivingLicenseNumber || "No License"}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    Applied: {deliveryBoy.createdAt ? new Date(deliveryBoy.createdAt).toLocaleDateString() : "N/A"}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {!deliveryBoy.approved ? (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                                    <Button
                                        onClick={() => handleApprove(deliveryBoy.id, deliveryBoy.fullName || deliveryBoy.name)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(deliveryBoy.id, deliveryBoy.fullName || deliveryBoy.name)}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleRemove(deliveryBoy.id, deliveryBoy.fullName || deliveryBoy.name)}
                                        variant="destructive"
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setSelectedDeliveryBoy(deliveryBoy)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleRemove(deliveryBoy.id, deliveryBoy.fullName || deliveryBoy.name)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredDeliveryBoys.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No delivery partners found</p>
                </div>
            )}

            {/* Delivery Boy Details Modal */}
            <Dialog open={!!selectedDeliveryBoy} onOpenChange={(open) => !open && setSelectedDeliveryBoy(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Delivery Partner Details</DialogTitle>
                    </DialogHeader>
                    {selectedDeliveryBoy && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{selectedDeliveryBoy.fullName || selectedDeliveryBoy.name}</h2>
                                    <p className="text-muted-foreground">{selectedDeliveryBoy.vehicleType || "Vehicle N/A"}</p>
                                </div>

                                {/* Personal Info */}
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Contact Information</p>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        {selectedDeliveryBoy.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        {selectedDeliveryBoy.phone}
                                    </div>
                                </div>

                                {/* Vehicle Info */}
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Vehicle & License</p>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Bike className="w-4 h-4" />
                                        {selectedDeliveryBoy.vehicleType}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="font-medium">License:</span>
                                        {selectedDeliveryBoy.drivingLicenseNumber || "N/A"}
                                    </div>
                                </div>

                                {/* Registration Date */}
                                <div className="flex items-center gap-2 text-muted-foreground pt-2">
                                    <Calendar className="w-4 h-4" />
                                    Applied: {selectedDeliveryBoy.createdAt ? new Date(selectedDeliveryBoy.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DeliveryApproval;
