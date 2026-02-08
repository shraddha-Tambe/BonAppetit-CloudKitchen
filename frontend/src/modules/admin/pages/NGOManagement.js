import { useState, useEffect } from "react";
import { Search, Heart, MapPin, Phone, Mail, Check, X, Trash2, Eye } from "lucide-react";
import API from "@/services/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { useApp } from "@/shared/context/AppContext";

const NGOManagement = () => {
    const { getImageUrl } = useApp();
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNGO, setSelectedNGO] = useState(null);
    const [filter, setFilter] = useState("all");

    // Fetch NGOs on mount
    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                setLoading(true);
                let all = [];

                // Try pending
                try {
                    const pendingRes = await API.get("/admin/ngos/pending");
                    if (pendingRes.data) all = [...pendingRes.data];
                } catch (e) {
                    console.error("Failed to fetch pending NGOs", e);
                }

                // Try approved
                try {
                    const approvedRes = await API.get("/admin/ngos/approved");
                    if (approvedRes.data) all = [...all, ...approvedRes.data];
                } catch (e) {
                    // console.error("Failed to fetch approved NGOs", e);
                }

                // Fallback: try generic /admin/ngos if logic differs
                if (all.length === 0) {
                    try {
                        const res = await API.get("/admin/ngos");
                        if (res.data) all = res.data;
                    } catch (e) { }
                }

                setNgos(all);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNGOs();
    }, []);

    const filteredNGOs = ngos.filter((ngo) => {
        const name = ngo.organizationName || ngo.name || "";
        const contact = ngo.contactNumber || ngo.contact || "";
        const searchUpper = searchTerm.toLowerCase();

        const matchesSearch =
            name.toLowerCase().includes(searchUpper) ||
            contact.toLowerCase().includes(searchUpper);

        const status = ngo.approved ? "approved" : "pending";
        const matchesFilter = filter === "all" || status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleApprove = async (id, name) => {
        try {
            await API.put(`/admin/approve/ngo/${id}`);
            toast.success(`${name} has been approved`);
            setSelectedNGO(null);
            // Refresh
            const { data } = await API.get("/admin/ngos/pending");
            setNgos(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve NGO");
        }
    };

    const handleReject = async (id, name) => {
        try {
            await API.put(`/admin/reject/ngo/${id}`);
            toast.success(`${name} has been rejected`);
            setSelectedNGO(null);
            // Refresh
            const { data } = await API.get("/admin/ngos/pending");
            setNgos(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject NGO");
        }
    };

    const handleRemove = async (id, name) => {
        await handleReject(id, name);
    };

    const approvedNGOs = ngos.filter((n) => n.approved).length;
    const pendingCount = ngos.filter((n) => !n.approved).length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">NGO Management</h2>
                    <p className="text-muted-foreground mt-1">
                        {pendingCount} NGOs pending approval
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search NGOs..."
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

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="stat-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{approvedNGOs}</p>
                        <p className="text-sm text-muted-foreground">Approved NGOs</p>
                    </div>
                </div>
                <div className="stat-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                        <p className="text-sm text-muted-foreground">Pending Approval</p>
                    </div>
                </div>
            </div>

            {/* NGO Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNGOs.map((ngo) => {
                    const name = ngo.organizationName || ngo.name || "Unknown NGO";
                    const contact = ngo.contactNumber || ngo.contact || "N/A";
                    const image = ngo.imageUrl || ngo.image;

                    return (
                        <div key={ngo.id} className="stat-card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center overflow-hidden">
                                        {image ?
                                            <img src={getImageUrl(image)} alt={name} className="w-full h-full object-cover" /> :
                                            <Heart className="w-6 h-6 text-pink-600" />
                                        }
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground">{name}</h3>
                                        <p className="text-sm text-muted-foreground">{ngo.type}</p>
                                    </div>
                                </div>
                                <span
                                    className={`status-badge ${ngo.approved ? "success" : "warning"}`}
                                >
                                    {ngo.approved ? "Approved" : "Pending"}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {ngo.email}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {contact}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    {ngo.city}
                                </div>
                            </div>

                            {/* Action Buttons - Matching RestaurantApproval Style */}
                            {!ngo.approved ? (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                                    <Button
                                        onClick={() => handleApprove(ngo.id, name)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(ngo.id, name)}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleRemove(ngo.id, name)}
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
                                        onClick={() => setSelectedNGO(ngo)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleRemove(ngo.id, name)}
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

            {/* NGO Details Modal */}
            <Dialog open={!!selectedNGO} onOpenChange={(open) => !open && setSelectedNGO(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>NGO Details</DialogTitle>
                    </DialogHeader>
                    {selectedNGO && (
                        <div className="space-y-6">
                            {/* NGO Image */}
                            {(selectedNGO.imageUrl || selectedNGO.image) && (
                                <div className="w-full h-64 rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={getImageUrl(selectedNGO.imageUrl || selectedNGO.image)}
                                        alt={selectedNGO.organizationName || selectedNGO.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {selectedNGO.organizationName || selectedNGO.name}
                                    </h2>
                                    <p className="text-muted-foreground">{selectedNGO.type}</p>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Contact Information</p>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        {selectedNGO.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        {selectedNGO.contactNumber || selectedNGO.contact}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">City</p>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {selectedNGO.city}
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedNGO.description && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">Mission / Description</p>
                                        <p className="text-foreground text-sm leading-relaxed">{selectedNGO.description}</p>
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
                                    <span className={`status-badge ${selectedNGO.approved ? "success" : "warning"}`}>
                                        {selectedNGO.approved ? "Approved" : "Pending"}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                {selectedNGO.approved && (
                                    <div className="flex gap-2 pt-4 border-t border-border">
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => {
                                                handleRemove(selectedNGO.id, selectedNGO.organizationName || selectedNGO.name);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove NGO
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NGOManagement;
