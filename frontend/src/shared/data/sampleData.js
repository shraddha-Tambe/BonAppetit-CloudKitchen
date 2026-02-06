export const sampleData = {
    restaurants: [
        {
            id: 'kitchen-001',
            name: 'My Kitchen',
            ownerName: 'Chef Kumar',
            email: 'owner@mykitchen.com',
            phone: '+91 98765 43210',
            address: '123 Food Street, Culinary District, Mumbai 400001',
            cuisine: 'Multi-Cuisine',
            description: 'Welcome to My Kitchen - where passion meets flavor! Our chef-curated dishes bring you the finest Indian, Continental, and fusion cuisines prepared with love and the freshest ingredients. Experience the taste of home-cooked meals with restaurant-quality presentation.',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
            rating: 4.8,
            reviewCount: 248,
            isMyKitchen: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            menu: [
                {
                    id: 'mk-1',
                    name: 'Butter Chicken Royale',
                    description: 'Tender chicken pieces in rich, creamy tomato-butter gravy with aromatic spices',
                    price: 320,
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: false,
                    rating: 4.9
                },
                {
                    id: 'mk-2',
                    name: 'Paneer Tikka Masala',
                    description: 'Grilled cottage cheese cubes in spiced onion-tomato gravy, a vegetarian delight',
                    price: 280,
                    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: true,
                    rating: 4.7
                },
                {
                    id: 'mk-3',
                    name: 'Crispy Samosa Platter',
                    description: 'Golden fried pastries stuffed with spiced potatoes and peas, served with chutneys',
                    price: 120,
                    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&h=300&fit=crop',
                    category: 'starters',
                    isVeg: true,
                    rating: 4.6
                },
                {
                    id: 'mk-4',
                    name: 'Chicken Biryani Special',
                    description: 'Fragrant basmati rice layered with marinated chicken, saffron, and whole spices',
                    price: 350,
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: false,
                    rating: 4.9
                },
                {
                    id: 'mk-5',
                    name: 'Gulab Jamun',
                    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup, served warm',
                    price: 100,
                    image: 'https://images.unsplash.com/photo-1666190050355-a7dcd058a58b?w=400&h=300&fit=crop',
                    category: 'desserts',
                    isVeg: true,
                    rating: 4.8
                },
                {
                    id: 'mk-6',
                    name: 'Fresh Mango Lassi',
                    description: 'Creamy yogurt drink blended with ripe Alphonso mangoes',
                    price: 80,
                    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop',
                    category: 'drinks',
                    isVeg: true,
                    rating: 4.7
                },
                {
                    id: 'mk-7',
                    name: 'Tandoori Chicken',
                    description: 'Whole chicken marinated in yogurt and spices, cooked in clay oven',
                    price: 380,
                    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
                    category: 'starters',
                    isVeg: false,
                    rating: 4.8
                },
                {
                    id: 'mk-8',
                    name: 'Dal Makhani',
                    description: 'Slow-cooked black lentils in creamy butter and tomato sauce',
                    price: 220,
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: true,
                    rating: 4.6
                }
            ]
        },
        {
            id: 'rest-002',
            name: 'Spice Garden',
            ownerName: 'Priya Sharma',
            email: 'priya@spicegarden.com',
            phone: '+91 98765 43211',
            address: '45 Masala Lane, Spice Market, Delhi 110001',
            cuisine: 'North Indian',
            description: 'Authentic North Indian flavors with a modern twist. Our recipes have been passed down through generations.',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
            rating: 4.5,
            reviewCount: 156,
            createdAt: '2024-02-15T00:00:00.000Z',
            menu: [
                {
                    id: 'sg-1',
                    name: 'Chole Bhature',
                    description: 'Spiced chickpea curry with fluffy fried bread',
                    price: 150,
                    image: 'https://images.unsplash.com/photo-1626132647523-66d53a96a80d?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: true,
                    rating: 4.5
                },
                {
                    id: 'sg-2',
                    name: 'Kadai Paneer',
                    description: 'Cottage cheese cooked with bell peppers in spicy kadai masala',
                    price: 260,
                    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: true,
                    rating: 4.4
                },
                {
                    id: 'sg-3',
                    name: 'Masala Chai',
                    description: 'Traditional spiced tea with ginger and cardamom',
                    price: 40,
                    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
                    category: 'drinks',
                    isVeg: true,
                    rating: 4.6
                }
            ]
        },
        {
            id: 'rest-003',
            name: 'Dragon Bowl',
            ownerName: 'Chen Wei',
            email: 'chen@dragonbowl.com',
            phone: '+91 98765 43212',
            address: '78 China Town, Kolkata 700016',
            cuisine: 'Chinese',
            description: 'Authentic Indo-Chinese cuisine that brings the best of both worlds to your plate.',
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=500&fit=crop',
            rating: 4.3,
            reviewCount: 98,
            createdAt: '2024-03-10T00:00:00.000Z',
            menu: [
                {
                    id: 'db-1',
                    name: 'Hakka Noodles',
                    description: 'Stir-fried noodles with vegetables and Indo-Chinese spices',
                    price: 180,
                    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: true,
                    rating: 4.3
                },
                {
                    id: 'db-2',
                    name: 'Chilli Chicken',
                    description: 'Crispy fried chicken tossed in spicy chilli sauce',
                    price: 280,
                    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
                    category: 'starters',
                    isVeg: false,
                    rating: 4.4
                },
                {
                    id: 'db-3',
                    name: 'Manchow Soup',
                    description: 'Spicy vegetable soup with crispy noodles',
                    price: 120,
                    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
                    category: 'starters',
                    isVeg: true,
                    rating: 4.2
                }
            ]
        },
        {
            id: 'rest-004',
            name: 'Pizza Paradise',
            ownerName: 'Marco Rossi',
            email: 'marco@pizzaparadise.com',
            phone: '+91 98765 43213',
            address: '12 Italian Street, Bangalore 560001',
            cuisine: 'Italian',
            description: 'Wood-fired pizzas and authentic Italian pasta made with imported ingredients.',
            image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&h=500&fit=crop',
            rating: 4.6,
            reviewCount: 203,
            createdAt: '2024-04-05T00:00:00.000Z',
            menu: [
                {
                    id: 'pp-1',
                    name: 'Margherita Pizza',
                    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
                    price: 350,
                    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: true,
                    rating: 4.7
                },
                {
                    id: 'pp-2',
                    name: 'Pasta Carbonara',
                    description: 'Creamy pasta with bacon, egg, and parmesan',
                    price: 320,
                    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
                    category: 'main',
                    isVeg: false,
                    rating: 4.5
                },
                {
                    id: 'pp-3',
                    name: 'Tiramisu',
                    description: 'Classic Italian coffee-flavored dessert',
                    price: 180,
                    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
                    category: 'desserts',
                    isVeg: true,
                    rating: 4.8
                }
            ]
        }
    ],
    ngos: [
        {
            id: 'ngo-001',
            name: 'Feeding Hope Foundation',
            type: 'foundation',
            city: 'Mumbai',
            contact: '+91 98765 11111',
            description: 'We work to eliminate hunger by collecting and distributing surplus food to underprivileged communities across Mumbai.',
            image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
            email: 'contact@feedinghope.org',
            isApproved: true
        },
        {
            id: 'ngo-002',
            name: 'Annapurna Ashram',
            type: 'ashram',
            city: 'Delhi',
            contact: '+91 98765 22222',
            description: 'A spiritual community dedicated to serving meals to the needy. We believe no one should sleep hungry.',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop',
            email: 'info@annapurnaashram.org',
            isApproved: true
        },
        {
            id: 'ngo-003',
            name: 'Share A Meal Trust',
            type: 'trust',
            city: 'Bangalore',
            contact: '+91 98765 33333',
            description: 'Connecting restaurants with excess food to shelters and communities in need. Every meal shared is a life touched.',
            image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop',
            email: 'hello@shareameal.org',
            isApproved: false
        }
    ],
    deliveryBoys: [
        {
            id: 'del-001',
            name: 'Rajesh Kumar',
            phone: '+91 98765 55555',
            email: 'rajesh@delivery.com',
            password: 'delivery123',
            vehicle: 'Motorcycle',
            drivingLicenseNumber: 'DL-2024-001',
            isAvailable: true,
            approved: true,
            createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
            id: 'del-002',
            name: 'Suresh Yadav',
            phone: '+91 98765 66666',
            email: 'suresh@delivery.com',
            password: 'delivery123',
            vehicle: 'Bicycle',
            drivingLicenseNumber: 'DL-2024-002',
            isAvailable: true,
            approved: true,
            createdAt: '2024-02-20T00:00:00.000Z'
        }
    ],
    users: [
        {
            id: 'user-001',
            name: 'Demo User',
            email: 'user@demo.com',
            phone: '+91 98765 00001',
            password: 'user123',
            address: '123 Customer Street, Mumbai 400001',
            role: 'user',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'user-002',
            name: 'Chef Kumar',
            email: 'owner@mykitchen.com',
            phone: '+91 98765 43210',
            password: 'kitchen123',
            address: '123 Food Street, Culinary District, Mumbai 400001',
            role: 'restaurant',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'user-003',
            name: 'NGO Admin',
            email: 'admin@ngo.com',
            phone: '+91 98765 77777',
            password: 'ngo123',
            address: '456 Charity Lane, Mumbai 400002',
            role: 'ngo',
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ],
    reviews: [
        {
            id: 'rev-001',
            userId: 'user-001',
            userName: 'Demo User',
            restaurantId: 'kitchen-001',
            rating: 5,
            comment: 'Amazing food! The Butter Chicken was absolutely delicious. Will order again!',
            createdAt: '2024-06-15T10:30:00.000Z'
        },
        {
            id: 'rev-002',
            userId: 'user-001',
            userName: 'Demo User',
            restaurantId: 'kitchen-001',
            rating: 5,
            comment: 'Best biryani in town! The flavors are authentic and portions are generous.',
            createdAt: '2024-06-10T14:20:00.000Z'
        }
    ]
};
