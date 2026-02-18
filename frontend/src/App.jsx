import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/shared/context/AppContext";

// Auth
import Login from "@/modules/auth/pages/Login";
import Register from "@/modules/auth/pages/Register";

// Customer
import Home from "@/modules/customer/pages/Home";
import Restaurants from "@/modules/customer/pages/Restaurants";
import RestaurantDetails from "@/modules/customer/pages/RestaurantDetails";
import MenuPage from "@/modules/customer/pages/Menu";
import Cart from "@/modules/customer/pages/Cart";
import NGOPage from "@/modules/customer/pages/NGO";
import NGODashboard from "@/modules/ngo/pages/NGODashboard";
import AvailableFoodDonations from "@/modules/ngo/pages/AvailableFoodDonations";
import MoneyDonations from "@/modules/ngo/pages/MoneyDonations";

// Admin
import AdminDashboard from "@/modules/admin/pages/AdminDashboard";
import DashboardOverview from "@/modules/admin/pages/DashboardOverview";
import CustomerManagement from "@/modules/admin/pages/CustomerManagement";
import RestaurantApproval from "@/modules/admin/pages/RestaurantApproval";
import DeliveryApproval from "@/modules/admin/pages/DeliveryApproval";
import DeliveryManagement from "@/modules/admin/pages/DeliveryManagement";
import OrdersView from "@/modules/admin/pages/OrdersView";
import NGOManagement from "@/modules/admin/pages/NGOManagement";
import AnalyticsDashboard from "@/modules/admin/pages/AnalyticsDashboard";
import DishManagement from "@/modules/admin/pages/DishManagement";

// Restaurant
import OwnerDashboard from "@/modules/restaurant/pages/Dashboard";

// Delivery
import DeliveryDashboard from "@/modules/delivery/pages/Dashboard";

// Shared
import NotFound from "@/shared/components/NotFound";
import ScrollToTop from "@/shared/components/ScrollToTop";
import ProtectedRoute from "@/shared/routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/menu/:id" element={<MenuPage />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/ngo" element={<NGOPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Module Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="restaurants" element={<RestaurantApproval />} />
              <Route path="delivery-approval" element={<DeliveryApproval />} />
              <Route path="delivery" element={<DeliveryManagement />} />
              <Route path="orders" element={<OrdersView />} />
              <Route path="ngo" element={<NGOManagement />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="dishes" element={<DishManagement />} />
            </Route>
            <Route path="/owner-dashboard" element={
              <ProtectedRoute allowedRole="RESTAURANT">
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/delivery-dashboard" element={
              <ProtectedRoute allowedRole="DELIVERY">
                <DeliveryDashboard />
              </ProtectedRoute>
            } />
            <Route path="/ngo-dashboard" element={
              <ProtectedRoute allowedRole="NGO">
                <NGODashboard />
              </ProtectedRoute>
            } />
            <Route path="/ngo/food" element={
              <ProtectedRoute allowedRole="NGO">
                <AvailableFoodDonations />
              </ProtectedRoute>
            } />
            <Route path="/ngo/money" element={
              <ProtectedRoute allowedRole="NGO">
                <MoneyDonations />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
