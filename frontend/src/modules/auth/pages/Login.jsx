import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChefHat, User, Truck, Mail, Lock, Eye, EyeOff } from "lucide-react";

import API from "@/services/api";

import { Layout } from "@/shared/components/layout/Layout";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toast } from "@/shared/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const roleParam = searchParams.get("role");
    return roleParam || "user";
  });

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // ================= LOGIN HANDLER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        role: activeTab.toUpperCase()
      });

      if (!res.data.success) {
        throw { response: { data: { message: res.data.message } } };
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (res.data.id) localStorage.setItem("id", res.data.id);

      toast({
        title: "Welcome!",
        description: res.data.message,
        variant: "success"
      });

      const userRole = (res.data.role || "").toUpperCase();
      if (userRole === "ADMIN") navigate("/admin");
      else if (userRole === "RESTAURANT") navigate("/owner-dashboard");
      else if (userRole === "DELIVERY") navigate("/delivery-dashboard");
      else navigate("/");

    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message || "Invalid credentials",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  // ================= UI =================
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 relative overflow-hidden">

        <div className="w-full max-w-md px-4">
          <div className="glass p-8 rounded-2xl shadow-2xl border">

            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-primary-foreground" />
                </div>
              </Link>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your account
              </p>
            </div>

            {/* Role Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="user">
                  <User className="w-4 h-4 mr-1" />
                  User
                </TabsTrigger>
                <TabsTrigger value="restaurant">
                  <ChefHat className="w-4 h-4 mr-1" />
                  Restaurant
                </TabsTrigger>
                <TabsTrigger value="delivery">
                  <Truck className="w-4 h-4 mr-1" />
                  Delivery
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

            </form>

            {/* Register */}
            <p className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link
                to={`/register?role=${activeTab}`}
                className="text-primary underline"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Login;
