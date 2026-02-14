
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { getToken, getRole, logout } from "@/utils/auth";
import API from "@/services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [stats, setStats] = useState({ pendingRestaurants: 0, pendingDeliveryBoys: 0 });

  // Sync active section with URL
  const getActiveSection = () => {
    const path = location.pathname.split("/").pop();
    return path === "admin" ? "dashboard" : path;
  };

  const activeSection = getActiveSection();

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
      const fetchNotifications = async () => {
          try {
              // Using API service instead of direct fetch
              const response = await API.get("/admin/stats");
              const data = response.data || {};
              setStats(data);
              const count = (data.pendingRestaurants || 0) + (data.pendingDeliveryBoys || 0);
              setNotificationCount(count);
          } catch (error) {
              console.error("Failed to fetch notifications", error);
          }
      };
      
      fetchNotifications();
      // Poll every 30 seconds for real-time-ish updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${!isDesktopSidebarOpen ? "lg:-translate-x-full" : ""}`}
      >
        <AdminSidebar
          activeSection={activeSection}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isDesktopSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-foreground capitalize">
                  {activeSection === "ngo" ? "NGO Management" : activeSection.replace(/-/g, " ").replace("_", " ")}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-destructive rounded-full flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificationCount === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No new notifications
                    </div>
                  ) : (
                    <>
                       {stats.pendingRestaurants > 0 && (
                           <DropdownMenuItem onClick={() => navigate("/admin/restaurants")}>
                               {stats.pendingRestaurants} Pending Restaurants
                           </DropdownMenuItem>
                       )}
                       {stats.pendingDeliveryBoys > 0 && (
                           <DropdownMenuItem onClick={() => navigate("/admin/delivery-approval")}>
                               {stats.pendingDeliveryBoys} Pending Delivery Partners
                           </DropdownMenuItem>
                       )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

