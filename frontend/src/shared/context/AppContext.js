import React, { createContext, useContext, useState, useEffect } from 'react';
import API from "@/services/api";
import { sampleData } from '@/shared/data/sampleData';
const AppContext = createContext(undefined);
const generateId = () => Math.random().toString(36).substr(2, 9);
export const AppProvider = ({ children }) => {

    const [restaurants, setRestaurants] = useState([]);
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    // ... other states ...

    const [currentUser, setCurrentUser] = useState(null);

    // Initial Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode token to get user info (role, email, etc)
                // We use the same logic as auth.js helper
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const user = JSON.parse(jsonPayload);
                // The token payload usually has 'sub' for email and 'role'
                // We map them to our currentUser structure
                setCurrentUser({
                    email: user.sub,
                    role: user.role,
                    id: user.id || localStorage.getItem('id'), // Fallback if ID is stored separately
                    name: 'User', // Placeholder if name isn't in token
                    phone: '',
                    address: ''
                });
            } catch (e) {
                console.error("Failed to restore user session", e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Approved Restaurants
                const restRes = await API.get("/restaurants");
                const approvedRestaurants = Array.isArray(restRes.data) ? restRes.data : [];

                // Fetch Approved NGOs
                try {
                    const ngoRes = await API.get("/ngos"); // Public endpoint for approved NGOs
                    if (ngoRes.data && Array.isArray(ngoRes.data)) {
                        const mappedNgos = ngoRes.data.map(n => ({
                            ...n,
                            name: n.organizationName || n.name,
                            image: n.imageUrl || n.image
                        }));
                        setNgos(mappedNgos);
                    }
                } catch (e) {
                    console.error("Failed to fetch NGOs", e);
                }

                // Fetch dishes from public endpoint
                const dishesRes = await API.get("/dishes");
                console.log("DEBUG: /dishes response:", dishesRes.data);
                const adminDishes = Array.isArray(dishesRes.data) ? dishesRes.data : [];

                let allRestaurants = [...approvedRestaurants];

                // Find or Create "My Kitchen" representation for frontend
                let myKitchen = allRestaurants.find(r => r.restaurantName === "My Kitchen");
                console.log("DEBUG: Found My Kitchen in list:", myKitchen);

                if (myKitchen) {
                    myKitchen.isMyKitchen = true;
                    myKitchen.menu = adminDishes;
                    if (!myKitchen.rating) myKitchen.rating = 4.8;
                    if (!myKitchen.reviewCount) myKitchen.reviewCount = 200;
                    if (!myKitchen.address) myKitchen.address = 'Pune';
                    if (!myKitchen.image) myKitchen.image = 'https://webdesignbybrandon.com/wp-content/uploads/2022/11/Best-Practices-for-Effective-Restaurant-Website-Design-1.jpg';

                    console.log("DEBUG: Attached menu to existing My Kitchen");
                } else {
                    // Fallback: Always create a "My Kitchen" placeholder if not found in backend
                    // This ensures the Home page section always works
                    myKitchen = {
                        id: 'my-kitchen-fallback',
                        restaurantName: 'My Kitchen',
                        name: 'My Kitchen',
                        isMyKitchen: true,
                        description: 'Welcome to My Kitchen. We serve fresh and delicious food.',
                        phone: '9999999999',
                        address: 'Pune',
                        menu: adminDishes,
                        rating: 5.0,
                        approved: true,
                        image: 'https://webdesignbybrandon.com/wp-content/uploads/2022/11/Best-Practices-for-Effective-Restaurant-Website-Design-1.jpg'
                    };
                    allRestaurants.unshift(myKitchen);
                    console.log("DEBUG: Created artificial My Kitchen fallback");
                }

                // Map backend properties to frontend expected properties if needed
                const mappedRestaurants = allRestaurants.map(r => ({
                    ...r,
                    name: r.restaurantName || r.name, // Handle backend/frontend mismatch
                    menu: r.menu || [] // Ensure menu array
                }));

                console.log("DEBUG: Final mapped restaurants:", mappedRestaurants);

                setRestaurants(mappedRestaurants);

            } catch (error) {
                console.error("Context fetch failed", error);
                // Fallback to sample data only on error ? or just empty?
                // setRestaurants(sampleData.restaurants);
            }
        };
        fetchInitialData();
    }, []);

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : [];
    });
    const [ngos, setNgos] = useState(() => {
        const saved = localStorage.getItem('ngos');
        const parsed = saved ? JSON.parse(saved) : null;
        return parsed || sampleData.ngos;
    });
    const [moneyDonations, setMoneyDonations] = useState(() => {
        const saved = localStorage.getItem('moneyDonations');
        return saved ? JSON.parse(saved) : [];
    });
    const [foodDonations, setFoodDonations] = useState(() => {
        const saved = localStorage.getItem('foodDonations');
        return saved ? JSON.parse(saved) : [];
    });
    const [deliveryBoys, setDeliveryBoys] = useState(() => {
        const saved = localStorage.getItem('deliveryBoys');
        const parsed = saved ? JSON.parse(saved) : null;
        return parsed || sampleData.deliveryBoys;
    });
    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem('reviews');
        return saved ? JSON.parse(saved) : sampleData.reviews;
    });
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('users');
        const parsed = saved ? JSON.parse(saved) : null;
        return parsed || sampleData.users;
    });
    // Persist to localStorage

    useEffect(() => {
        // Remove restaurants from localStorage to prevent QuotaExceededError
        // We fetch restaurants from API, so persistence is not needed and causes issues with large images
        try {
            localStorage.removeItem('restaurants');
        } catch (e) {
            console.error("Failed to clear restaurants from storage", e);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);
    useEffect(() => {
        localStorage.setItem('ngos', JSON.stringify(ngos));
    }, [ngos]);
    useEffect(() => {
        localStorage.setItem('moneyDonations', JSON.stringify(moneyDonations));
    }, [moneyDonations]);
    useEffect(() => {
        localStorage.setItem('foodDonations', JSON.stringify(foodDonations));
    }, [foodDonations]);
    useEffect(() => {
        localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
    }, [deliveryBoys]);
    useEffect(() => {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }, [reviews]);
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    // Restaurant functions
    const addRestaurant = (restaurantData) => {
        const newRestaurant = {
            ...restaurantData,
            id: generateId(),
            rating: 0,
            reviewCount: 0,
            approved: false,
            createdAt: new Date().toISOString()
        };
        setRestaurants(prev => [...prev, newRestaurant]);
    };
    const getRestaurant = (id) => restaurants.find(r => r.id === id);
    const approveRestaurant = (id) => {
        setRestaurants(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
    };
    const rejectRestaurant = (id) => {
        setRestaurants(prev => prev.map(r => r.id === id ? { ...r, approved: false } : r));
    };
    const removeRestaurant = (id) => {
        setRestaurants(prev => prev.filter(r => r.id !== id));
    };
    // Cart functions
    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.menuItem.id === item.menuItem.id);
            if (existing) {
                return prev.map(i => i.menuItem.id === item.menuItem.id
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i);
            }
            return [...prev, item];
        });
    };
    const removeFromCart = (menuItemId) => {
        setCart(prev => prev.filter(i => i.menuItem.id !== menuItemId));
    };
    const updateCartQuantity = (menuItemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(menuItemId);
            return;
        }
        setCart(prev => prev.map(i => i.menuItem.id === menuItemId ? { ...i, quantity } : i));
    };
    const clearCart = () => setCart([]);
    const getCartTotal = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
        const tax = subtotal * 0.05;
        const deliveryCharge = cart.length > 0 ? 40 : 0;
        return {
            subtotal,
            tax,
            deliveryCharge,
            total: subtotal + tax + deliveryCharge
        };
    };
    // Order functions
    const createOrder = (orderData) => {
        const newOrder = {
            ...orderData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };
    const updateOrderStatus = (orderId, status, deliveryBoyId) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const deliveryBoy = deliveryBoyId ? deliveryBoys.find(b => b.id === deliveryBoyId) : undefined;
                return {
                    ...order,
                    status,
                    deliveryBoyId: deliveryBoyId || order.deliveryBoyId,
                    deliveryBoyName: deliveryBoy?.name || order.deliveryBoyName,
                    updatedAt: new Date().toISOString()
                };
            }
            return order;
        }));
    };
    const getUserOrders = (userId) => orders.filter(o => o.userId === userId);
    const getRestaurantOrders = (restaurantId) => orders.filter(o => o.restaurantId === restaurantId);
    const getDeliveryOrders = (deliveryBoyId) => orders.filter(o => o.deliveryBoyId === deliveryBoyId || o.status === 'ready');
    // NGO functions
    const addNGO = (ngoData) => {
        const newNGO = { ...ngoData, id: generateId(), isApproved: false };
        setNgos(prev => [...prev, newNGO]);
    };
    const approveNGO = (id) => {
        setNgos(prev => prev.map(n => n.id === id ? { ...n, isApproved: true } : n));
    };
    const rejectNGO = (id) => {
        setNgos(prev => prev.map(n => n.id === id ? { ...n, isApproved: false } : n));
    };
    const removeNGO = (id) => {
        setNgos(prev => prev.filter(n => n.id !== id));
    };
    const getApprovedNGOs = () => ngos.filter(n => n.approved || n.isApproved);
    // Donation functions
    const addMoneyDonation = (donationData) => {
        const newDonation = {
            ...donationData,
            id: generateId(),
            createdAt: new Date().toISOString()
        };
        setMoneyDonations(prev => [newDonation, ...prev]);
    };
    const addFoodDonation = (donationData) => {
        const newDonation = {
            ...donationData,
            id: generateId(),
            createdAt: new Date().toISOString()
        };
        setFoodDonations(prev => [newDonation, ...prev]);
    };
    const claimFoodDonation = (donationId, ngoId, ngoName) => {
        setFoodDonations(prev => prev.map(d => d.id === donationId ? { ...d, ngoId, ngoName, status: 'claimed' } : d));
    };
    // Delivery functions
    const registerDeliveryBoy = (boyData) => {
        const newBoy = {
            ...boyData,
            id: generateId(),
            isAvailable: true,
            approved: false,
            createdAt: new Date().toISOString()
        };
        setDeliveryBoys(prev => [...prev, newBoy]);
    };
    const approveDeliveryBoy = (id) => {
        setDeliveryBoys(prev => prev.map(b => b.id === id ? { ...b, approved: true } : b));
    };
    const rejectDeliveryBoy = (id) => {
        setDeliveryBoys(prev => prev.map(b => b.id === id ? { ...b, approved: false } : b));
    };
    const removeDeliveryBoy = (id) => {
        setDeliveryBoys(prev => prev.filter(b => b.id !== id));
    };
    // Review functions
    const addReview = (reviewData) => {
        const newReview = {
            ...reviewData,
            id: generateId(),
            createdAt: new Date().toISOString()
        };
        setReviews(prev => [newReview, ...prev]);
        // Update restaurant rating
        const restaurantReviews = [...reviews.filter(r => r.restaurantId === reviewData.restaurantId), newReview];
        const avgRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;
        setRestaurants(prev => prev.map(r => r.id === reviewData.restaurantId
            ? { ...r, rating: Math.round(avgRating * 10) / 10, reviewCount: restaurantReviews.length }
            : r));
    };
    const getRestaurantReviews = (restaurantId) => reviews.filter(r => r.restaurantId === restaurantId);
    // Coupon
    const applyCoupon = (code) => {
        if (code.toUpperCase() === 'WELCOME10') {
            return { valid: true, discount: 10 };
        }
        if (code.toUpperCase() === 'FLAT50') {
            return { valid: true, discount: 50 };
        }
        return { valid: false, discount: 0 };
    };
    return (<AppContext.Provider value={{

        currentUser,
        restaurants,
        addRestaurant,
        getRestaurant,
        approveRestaurant,
        rejectRestaurant,
        removeRestaurant,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        orders,
        createOrder,
        updateOrderStatus,
        getUserOrders,
        getRestaurantOrders,
        getDeliveryOrders,
        ngos,
        addNGO,
        approveNGO,
        rejectNGO,
        removeNGO,
        getApprovedNGOs,
        moneyDonations,
        foodDonations,
        addMoneyDonation,
        addFoodDonation,
        claimFoodDonation,
        deliveryBoys,
        registerDeliveryBoy,
        approveDeliveryBoy,
        rejectDeliveryBoy,
        removeDeliveryBoy,
        reviews,
        addReview,
        getRestaurantReviews,
        applyCoupon,
        getRecommendations: async (userId) => {
            try {
                // If no userId provided, it might fail on backend if path variable is required
                // But let's assume caller provides it.
                if (!userId) return [];
                const res = await API.get(`/recommendations/${userId}`);
                return res.data;
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
                return [];
            }
        },
        getImageUrl: (path) => {
            if (!path) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
            if (path.startsWith('http') || path.startsWith('data:')) return path;

            // Handle paths that might already have 'uploads/' or 'images/' from backend
            if (path.startsWith('/')) path = path.substring(1);

            // If path doesn't start with images/ or uploads/, prepend images/
            if (!path.startsWith('images/') && !path.startsWith('uploads/')) {
                path = `images/${path}`;
            }

            return `http://localhost:8080/${path}`;
        }
    }}>
        {children}
    </AppContext.Provider>);
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
