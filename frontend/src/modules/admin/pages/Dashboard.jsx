import { useApp } from '@/shared/context/AppContext';

const Dashboard = () => {
  const context = useApp();
  const users = context.users || [];
  const restaurants = context.restaurants || [];
  const orders = context.orders || [];

  // Calculate total revenue from all orders
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  // Count approved restaurants only
  const approvedRestaurants = restaurants.filter(r => r.approved).length;

  return (
    <>
      <h1>Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Approved Restaurants</p>
            <h3 className="text-2xl font-bold mt-1">{approvedRestaurants}</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h3 className="text-2xl font-bold mt-1">{orders.length}</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Revenue</p>
            <h3 className="text-2xl font-bold mt-1 text-primary">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
