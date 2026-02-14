import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChefHat, User, Truck, Heart, Eye, EyeOff } from "lucide-react";

import API from "@/services/api";

import { Layout } from "@/shared/components/layout/Layout";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/shared/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { toast } from "@/shared/hooks/use-toast";

const Register = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("role") || "user"
  );

  const [isLoading, setIsLoading] = useState(false);

  // ================= STATES =================

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: ""
  });

  const [restaurantForm, setRestaurantForm] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    cuisineType: "",
    address: "",
    description: "",
    licenseNumber: "",
    imageUrl: ""
  });

  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "",
    drivingLicenseNumber: ""
  });

  const [ngoForm, setNgoForm] = useState({
    organizationName: "",
    type: "",
    city: "",
    email: "",
    contactNumber: "",
    password: "",
    description: "",
    imageUrl: ""
  });

  // ================= USER REGISTER =================

  const handleUserRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/auth/register/user", userForm);

      toast({ title: "Registration successful", variant: "success" });
      navigate("/login?role=user");

    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Error",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  // ================= RESTAURANT REGISTER =================

  const handleRestaurantRegister = async (e) => {
    e.preventDefault();
    if (!restaurantForm.image) {
      toast({ title: "Image is required", description: "Please upload a restaurant image.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(restaurantForm).forEach(key => {
        formData.append(key, restaurantForm[key]);
      });

      // API call needs to handle multipart (axios usually handles it if data is FormData)
      // Check API.post usage.
      await API.post("/auth/register/restaurant", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: "Restaurant registered",
        description: "Wait for admin approval",
        variant: "success"
      });

      navigate("/login?role=restaurant");

    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Error",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  // ================= DELIVERY REGISTER =================

  const handleDeliveryRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/auth/register/delivery", deliveryForm);

      toast({
        title: "Registered successfully",
        description: "Wait for admin approval",
        variant: "success"
      });

      navigate("/login?role=delivery");

    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Error",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  // ================= NGO REGISTER =================

  const handleNGORegister = async (e) => {
    e.preventDefault();
    if (!ngoForm.image) {
      toast({ title: "Image is required", description: "Please upload an NGO image.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(ngoForm).forEach(key => {
        formData.append(key, ngoForm[key]);
      });

      await API.post("/auth/register/ngo", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: "NGO registered",
        description: "Wait for admin approval",
        variant: "success"
      });

      navigate("/login?role=ngo");

    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Error",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  // ================= UI =================

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="w-full max-w-xl px-4">
          <div className="food-card p-8">

            <div className="text-center mb-8">
              <ChefHat className="w-12 h-12 mx-auto text-primary" />
              <h1 className="text-2xl font-bold">Create Account</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>

              {/* ================= USER ================= */}
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="ngo">NGO</TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <form onSubmit={handleUserRegister} className="space-y-4">
                  <Input placeholder="Full Name"
                    value={userForm.fullName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, fullName: e.target.value })}
                  />
                  <Input placeholder="Email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })}
                  />
                  <Input placeholder="Phone"
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm({ ...userForm, phone: e.target.value })}
                  />
                  <Input type="password" placeholder="Password"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })}
                  />
                  <Textarea placeholder="Address"
                    value={userForm.address}
                    onChange={(e) =>
                      setUserForm({ ...userForm, address: e.target.value })}
                  />
                  <Button className="w-full">Register</Button>
                </form>
              </TabsContent>

              {/* ================= RESTAURANT ================= */}
              <TabsContent value="restaurant">
                <form onSubmit={handleRestaurantRegister} className="space-y-3">
                  <Input placeholder="Restaurant Name"
                    value={restaurantForm.restaurantName}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, restaurantName: e.target.value })}
                  />
                  <Input placeholder="Owner Name"
                    value={restaurantForm.ownerName}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, ownerName: e.target.value })}
                  />
                  <Input placeholder="Email"
                    value={restaurantForm.email}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                  />
                  <Input placeholder="Phone"
                    value={restaurantForm.phone}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                  />
                  <Input type="password" placeholder="Password"
                    value={restaurantForm.password}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, password: e.target.value })}
                  />
                  <Input placeholder="Cuisine Type"
                    value={restaurantForm.cuisineType}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, cuisineType: e.target.value })}
                  />
                  <Input placeholder="Address"
                    value={restaurantForm.address}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                  />
                  <Textarea placeholder="Description"
                    value={restaurantForm.description}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                  />
                  <Input placeholder="License Number"
                    value={restaurantForm.licenseNumber}
                    onChange={(e) =>
                      setRestaurantForm({ ...restaurantForm, licenseNumber: e.target.value })}
                  />
                  <div className="space-y-1">
                    <Label>Restaurant Image (Mandatory)</Label>
                    <Input type="file" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setRestaurantForm({ ...restaurantForm, image: file });
                      }}
                    />
                  </div>
                  <Button className="w-full">Register Restaurant</Button>
                </form>
              </TabsContent>

              {/* ================= DELIVERY ================= */}
              <TabsContent value="delivery">
                <form onSubmit={handleDeliveryRegister} className="space-y-3">
                  <Input placeholder="Full Name"
                    value={deliveryForm.fullName}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, fullName: e.target.value })}
                  />
                  <Input placeholder="Email"
                    value={deliveryForm.email}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, email: e.target.value })}
                  />
                  <Input placeholder="Phone"
                    value={deliveryForm.phone}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                  />
                  <Input type="password" placeholder="Password"
                    value={deliveryForm.password}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, password: e.target.value })}
                  />
                  <Input placeholder="Vehicle Type"
                    value={deliveryForm.vehicleType}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, vehicleType: e.target.value })}
                  />
                  <Input placeholder="Driving License Number"
                    value={deliveryForm.drivingLicenseNumber}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, drivingLicenseNumber: e.target.value })}
                  />
                  <Button className="w-full">Register Delivery</Button>
                </form>
              </TabsContent>

              {/* ================= NGO ================= */}
              <TabsContent value="ngo">
                <form onSubmit={handleNGORegister} className="space-y-3">
                  <Input placeholder="Organization Name"
                    value={ngoForm.organizationName}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, organizationName: e.target.value })}
                  />
                  <Input placeholder="Type"
                    value={ngoForm.type}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, type: e.target.value })}
                  />
                  <Input placeholder="City"
                    value={ngoForm.city}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, city: e.target.value })}
                  />
                  <Input placeholder="Email"
                    value={ngoForm.email}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, email: e.target.value })}
                  />
                  <Input placeholder="Contact Number"
                    value={ngoForm.contactNumber}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, contactNumber: e.target.value })}
                  />
                  <Input type="password" placeholder="Password"
                    value={ngoForm.password}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, password: e.target.value })}
                  />
                  <Textarea placeholder="Description"
                    value={ngoForm.description}
                    onChange={(e) =>
                      setNgoForm({ ...ngoForm, description: e.target.value })}
                  />
                  <div className="space-y-1">
                    <Label>NGO Image (Mandatory)</Label>
                    <Input type="file" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNgoForm({ ...ngoForm, image: file });
                      }}
                    />
                  </div>
                  <Button className="w-full">Register NGO</Button>
                </form>
              </TabsContent>

            </Tabs>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
