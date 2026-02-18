import { Navigate } from 'react-router-dom';
import { Truck, Package, MapPin, Clock, CheckCircle, Phone, Navigation } from 'lucide-react';
import { useApp } from '@/shared/context/AppContext';
import { Layout } from '@/shared/components/layout/Layout';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { toast } from '@/shared/hooks/use-toast';
import API from '@/services/api';
import { useState, useEffect } from 'react';
import { getUserDetails } from '@/utils/auth';

const DeliveryDashboard = () => {
  const { deliveryBoys } = useApp();
  const currentUser = getUserDetails();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is delivery boy
  // Backend role is "DELIVERY" (uppercase), frontend check should align
  if (!currentUser || (currentUser.role && currentUser.role.toUpperCase() !== 'DELIVERY')) {
    return <Navigate to="/login" replace />;
  }

  const deliveryBoy = deliveryBoys.find(b => b.email === currentUser.email);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [resAvailable, resMy] = await Promise.all([
        API.get('/orders/available'),
        API.get('/orders/delivery')
      ]);
      setAvailableOrders(resAvailable.data);
      setMyDeliveries(resMy.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeDeliveries = myDeliveries.filter(o => o.status !== 'delivered');
  const completedDeliveries = myDeliveries.filter(o => o.status === 'delivered');

  const handlePickupOrder = async (orderId) => {
    try {
      await API.put(`/orders/assign/${orderId}`);
      toast({
        title: 'Order Picked Up!',
        description: 'Start delivering the order.',
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign order',
        variant: 'destructive',
      });
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      await API.put(`/orders/status/${orderId}`, null, {
        params: { status: 'delivered' }
      });
      toast({
        title: 'Order Delivered!',
        description: 'Great job! The order has been marked as delivered.',
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  // Generate random ETA
  const getETA = () => Math.floor(Math.random() * 20) + 10;
  return (<Layout>
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Truck className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
            <p className="text-muted-foreground">Delivery Partner Dashboard</p>
          </div>
        </div>
        <Badge className="w-fit" variant={deliveryBoy?.isAvailable ? 'default' : 'secondary'}>
          {deliveryBoy?.isAvailable ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="food-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{availableOrders.length}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
        <div className="food-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeDeliveries.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="food-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedDeliveries.length}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </div>
        <div className="food-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{deliveryBoy?.vehicle || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Vehicle</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Orders */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="available" className="gap-2">
                <Package className="w-4 h-4" />
                Available ({availableOrders.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-2">
                <Truck className="w-4 h-4" />
                Active ({activeDeliveries.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </TabsTrigger>
            </TabsList>

            {/* Available Orders */}
            <TabsContent value="available" className="space-y-4">
              {availableOrders.length > 0 ? (availableOrders.map((order) => (<DeliveryCard key={order.id} order={order} eta={getETA()} actions={<Button className="w-full btn-primary-gradient" onClick={() => handlePickupOrder(order.id)}>
                Accept & Pickup
              </Button>} />))) : (<EmptyState icon={Package} message="No orders available for pickup" />)}
            </TabsContent>

            {/* Active Deliveries */}
            <TabsContent value="active" className="space-y-4">
              {activeDeliveries.length > 0 ? (activeDeliveries.map((order) => (<DeliveryCard key={order.id} order={order} eta={getETA()} isActive actions={<Button className="w-full btn-primary-gradient" onClick={() => handleDeliverOrder(order.id)}>
                Mark as Delivered
              </Button>} />))) : (<EmptyState icon={Truck} message="No active deliveries" />)}
            </TabsContent>

            {/* Completed Deliveries */}
            <TabsContent value="completed" className="space-y-4">
              {completedDeliveries.length > 0 ? (completedDeliveries.map((order) => (<DeliveryCard key={order.id} order={order} isCompleted />))) : (<EmptyState icon={CheckCircle} message="No completed deliveries yet" />)}
            </TabsContent>
          </Tabs>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-1">
          <div className="food-card overflow-hidden sticky top-24">
            <div className="h-64 bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Map View</p>
                <p className="text-xs text-muted-foreground">(Coming Soon)</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Delivery Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Call customer before arriving</li>
                <li>• Double-check the order items</li>
                <li>• Handle food packages carefully</li>
                <li>• Maintain proper delivery hygiene</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>);
};
const DeliveryCard = ({ order, eta, isActive, isCompleted, actions }) => {
  return (<div className={`food-card p-6 ${isActive ? 'border-2 border-primary' : ''}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="font-semibold text-foreground">Order #{order.id}</p>
        <p className="text-sm text-primary font-medium">{order.restaurant?.restaurantName || order.restaurantName}</p>
      </div>
      {isCompleted ? (<Badge className="bg-green-100 text-green-800">Delivered</Badge>) : isActive ? (<Badge className="bg-blue-100 text-blue-800">In Transit</Badge>) : (<Badge className="bg-amber-100 text-amber-800">Ready for Pickup</Badge>)}
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-start gap-2 text-sm">
        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">{order.deliveryAddress || order.userAddress}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Phone className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">{order.deliveryPhone || order.userPhone}</span>
      </div>
      {eta && !isCompleted && (<div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-primary font-medium">ETA: {eta} mins</span>
      </div>)}
    </div>

    <div className="bg-muted/50 rounded-lg p-3 mb-4">
      <p className="text-sm font-medium text-foreground mb-2">Order Items:</p>
      {order.items.map((item, index) => (<p key={index} className="text-sm text-muted-foreground">
        {item.quantity}x {item.menuItem?.name || item.name}
      </p>))}
      <p className="text-sm font-semibold text-primary mt-2">Total: ₹{(order.totalAmount || order.total || 0).toFixed(0)}</p>
    </div>

    {actions}

    <p className="text-xs text-muted-foreground mt-4">
      {new Date(order.createdAt).toLocaleString()}
    </p>
  </div>);
};
// Empty State Component
const EmptyState = ({ icon: Icon, message }) => (<div className="text-center py-12">
  <Icon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
  <p className="text-muted-foreground">{message}</p>
</div>);
export default DeliveryDashboard;
