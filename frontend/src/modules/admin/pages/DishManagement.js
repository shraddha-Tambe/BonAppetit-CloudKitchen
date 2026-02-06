import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, ImageIcon, X, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";

import API from "@/services/api";
import { useApp } from "@/shared/context/AppContext";

const categories = ["Starters", "Main Course", "Breakfast", "Desserts", "Beverages"];

const DishManagement = () => {
    const { getImageUrl } = useApp();
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        const fetchDishes = async () => {
            try {
                setLoading(true);
                // Optimistic: Fetch all dishes
                const response = await API.get("/dishes");
                if (response.data) setDishes(response.data);
            } catch (error) {
                console.error("Failed to fetch dishes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDishes();
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        imagePreview: null,
        imageFile: null
    });

    const filteredDishes = (Array.isArray(dishes) ? dishes : []).filter(
        (dish) => {
            const name = dish.name || "";
            const category = dish.category || "";
            return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase());
        }
    );

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ 
                ...formData, 
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.category) {
            toast.error("Please fill all required fields");
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("isVeg", true);
        data.append("available", true);
        
        if (formData.imageFile) {
            data.append("image", formData.imageFile);
        }

        try {
            if (editingDish) {
                await API.put(`/admin/dishes/update/${editingDish.id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                
                // Refresh list
                const { data: updatedDishes } = await API.get("/dishes");
                setDishes(updatedDishes);
                toast.success("Dish updated successfully");
            } else {
                await API.post("/admin/dishes/add", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                // Refresh list
                const { data: newDishes } = await API.get("/dishes");
                setDishes(newDishes);
                toast.success("Dish added successfully");
            }

            setFormData({ name: "", description: "", price: "", category: "", image: "", imagePreview: null, imageFile: null });
            setEditingDish(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Operation failed", error);
            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Error Status:", error.response.status);
            }
            toast.error(editingDish ? "Failed to update dish" : "Failed to add dish");
        }
    };

    const handleEdit = (dish) => {
        setEditingDish(dish);
        setFormData({
            name: dish.name,
            description: dish.description,
            price: dish.price.toString(),
            category: dish.category,
            image: dish.image,
            imagePreview: dish.image
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/admin/dishes/delete/${id}`);
            setDishes((prev) => prev.filter((dish) => dish.id !== id));
            toast.success("Dish deleted successfully");
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete dish");
        }
    };

    const toggleAvailability = (id) => {
        setDishes((prev) =>
            prev.map((dish) =>
                dish.id === id ? { ...dish, available: !dish.available } : dish
            )
        );
    };

    const openAddDialog = () => {
        setEditingDish(null);
        setFormData({ name: "", description: "", price: "", category: "", image: "", imagePreview: null });
        setIsDialogOpen(true);
    };

    const [currentUser, setCurrentUser] = useState({ role: "", email: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                setCurrentUser({ role: payload.role, email: payload.sub });
            } catch (e) {
                console.error("Token decode error", e);
            }
        }
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Debug Info */}
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                <p className="font-bold">Debug Info:</p>
                <p>Email: {currentUser.email}</p>
                <p>Role: {currentUser.role}</p>
                {currentUser.role !== 'ADMIN' && (
                    <p className="text-red-600 font-bold mt-2">
                        WARNING: You are NOT logged in as ADMIN. You cannot add dishes. 
                        Please Logout and Log In again using the "User" tab with admin credentials.
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">Manage Dishes</h2>
                    <p className="text-muted-foreground mt-1">Add, edit or remove dishes from your restaurant</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-accent hover:bg-accent/90" onClick={openAddDialog}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Dish
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="font-serif">
                                    {editingDish ? "Edit Dish" : "Add New Dish"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Dish Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter dish name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the dish"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Dish Image</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            id="image" 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="flex-1"
                                        />
                                        {formData.imagePreview && (
                                            <img 
                                                src={formData.imagePreview} 
                                                alt="Preview" 
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Upload a dish image (JPG, PNG, etc.)</p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <DialogClose asChild>
                                        <Button variant="outline" className="flex-1">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button onClick={handleSubmit} className="flex-1 bg-accent hover:bg-accent/90">
                                        {editingDish ? "Update" : "Add"} Dish
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Category Stats */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => {
                    const count = dishes.filter((d) => d.category === cat).length;
                    return (
                        <div key={cat} className="px-4 py-2 bg-muted rounded-lg text-sm">
                            <span className="font-medium text-foreground">{cat}</span>
                            <span className="text-muted-foreground ml-2">({count})</span>
                        </div>
                    );
                })}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDishes.map((dish) => (
                    <div key={dish.id} className={`stat-card overflow-hidden ${!dish.available ? 'opacity-60' : ''}`}>
                        {/* Dish Image */}
                        {dish.imageUrl && (
                            <div className="w-full h-32 bg-muted rounded-lg overflow-hidden mb-3">
                                <img 
                                    src={getImageUrl(dish.imageUrl || dish.image)}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"; }}
                                />
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                            <div></div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(dish)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(dish.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <h3 className="font-semibold text-lg text-foreground">{dish.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{dish.description}</p>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <div>
                                <p className="text-xl font-bold text-foreground">₹{dish.price}</p>
                                <p className="text-xs text-muted-foreground">{dish.category}</p>
                            </div>
                            <button
                                onClick={() => toggleAvailability(dish.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${dish.available
                                        ? "bg-success/10 text-success"
                                        : "bg-destructive/10 text-destructive"
                                    }`}
                            >
                                {dish.available ? "Available" : "Unavailable"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DishManagement;
