package com.kitchencloud.backend.service;

import com.kitchencloud.backend.model.DeliveryBoy;
import com.kitchencloud.backend.model.NGO;
import com.kitchencloud.backend.model.Restaurant;
import com.kitchencloud.backend.repository.DeliveryBoyRepository;
import com.kitchencloud.backend.repository.NGORepository;
import com.kitchencloud.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitchencloud.backend.model.MenuItem;
import com.kitchencloud.backend.repository.MenuItemRepository;

@Service
public class AdminService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;

    @Autowired
    private NGORepository ngoRepository;

    public java.util.List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public java.util.List<Restaurant> getPendingRestaurants() {
        return restaurantRepository.findByApproved(false);
    }

    public java.util.List<DeliveryBoy> getAllDeliveryBoys() {
        return deliveryBoyRepository.findAll();
    }

    public java.util.List<DeliveryBoy> getPendingDeliveryBoys() {
        return deliveryBoyRepository.findByApproved(false);
    }

    public java.util.List<NGO> getAllNGOs() {
        return ngoRepository.findAll();
    }

    public java.util.List<NGO> getPendingNGOs() {
        return ngoRepository.findByApproved(false);
    }

    public java.util.List<NGO> getApprovedNGOs() {
        return ngoRepository.findByApproved(true);
    }

    public java.util.List<MenuItem> getAllDishes() {
        return menuItemRepository.findByDeletedFalse();
    }

    public void approveRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        restaurant.setApproved(true);
        restaurantRepository.save(restaurant);
    }

    public void rejectRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        restaurant.setApproved(false);
        restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public void approveDeliveryBoy(Long id) {
        DeliveryBoy deliveryBoy = deliveryBoyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));
        deliveryBoy.setApproved(true);
        deliveryBoyRepository.save(deliveryBoy);
    }

    public void rejectDeliveryBoy(Long id) {
        DeliveryBoy deliveryBoy = deliveryBoyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));
        deliveryBoy.setApproved(false);
        deliveryBoyRepository.save(deliveryBoy);
    }

    public void approveNGO(Long id) {
        NGO ngo = ngoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        ngo.setApproved(true);
        ngoRepository.save(ngo);
    }

    public void rejectNGO(Long id) {
        NGO ngo = ngoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        ngoRepository.delete(ngo);
    }

    @Autowired
    private com.kitchencloud.backend.repository.UserRepository userRepository;

    @Autowired
    private com.kitchencloud.backend.repository.OrderRepository orderRepository;

    public java.util.List<com.kitchencloud.backend.model.User> getAllCustomers() {
        return userRepository.findByRole("USER"); // Assuming 'USER' role for customers
    }

    public java.util.Map<String, Object> getDashboardStats() {
        long totalCustomers = userRepository.countByRole("USER");
        long activeRestaurants = restaurantRepository.countByApproved(true);
        long pendingRestaurants = restaurantRepository.countByApproved(false);
        long activeDeliveryBoys = deliveryBoyRepository.countByApproved(true);
        long pendingDeliveryBoys = deliveryBoyRepository.countByApproved(false);
        long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.calculateTotalRevenue();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("activeRestaurants", activeRestaurants);
        stats.put("pendingRestaurants", pendingRestaurants);
        stats.put("activeDeliveryBoys", activeDeliveryBoys);
        stats.put("pendingDeliveryBoys", pendingDeliveryBoys);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        return stats;
    }

    @Autowired
    private FileStorageService fileStorageService;

    // ... (existing includes above)

    public void addDish(com.kitchencloud.backend.dto.MenuItemDTO dto,
            org.springframework.web.multipart.MultipartFile imageFile) {
        Restaurant myKitchen = restaurantRepository.findByRestaurantName("My Kitchen")
                .stream().findFirst().orElseGet(() -> {
                    Restaurant r = new Restaurant();
                    r.setRestaurantName("My Kitchen");
                    r.setOwnerName("Admin");
                    r.setEmail("owner@mykitchen.com");
                    r.setPassword("password");
                    r.setApproved(true);
                    return restaurantRepository.save(r);
                });

        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(imageFile);
            item.setImageUrl(fileName);
        }

        item.setCategory(dto.getCategory());
        item.setVeg(dto.isVeg());
        item.setAvailable(true);
        item.setRestaurant(myKitchen);

        menuItemRepository.save(item);
    }

    public void updateDish(Long id, com.kitchencloud.backend.dto.MenuItemDTO dto,
            org.springframework.web.multipart.MultipartFile imageFile) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setCategory(dto.getCategory());
        item.setVeg(dto.isVeg());

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(imageFile);
            item.setImageUrl(fileName);
        }

        item.setAvailable(dto.isAvailable());

        menuItemRepository.save(item);
    }

    public void deleteDish(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found"));
        item.setDeleted(true);
        menuItemRepository.save(item);
    }

    public java.util.List<com.kitchencloud.backend.model.Order> getRecentOrders() {
        return orderRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public java.util.List<com.kitchencloud.backend.model.Order> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
    }

    public void assignDeliveryBoyToOrder(Long orderId, Long deliveryBoyId) {
        com.kitchencloud.backend.model.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getDeliveryBoy() != null) {
            throw new RuntimeException("Order already assigned to a delivery boy");
        }

        com.kitchencloud.backend.model.DeliveryBoy deliveryBoy = deliveryBoyRepository.findById(deliveryBoyId)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));

        // No need to check role as DeliveryBoy entity is strictly for delivery boys
        // But need to check if approved if that logic is strictly enforced (optional
        // for admin override)
        if (!deliveryBoy.isApproved()) {
            throw new RuntimeException("Delivery Boy is not approved");
        }

        order.setDeliveryBoy(deliveryBoy);
        order.setStatus("out-for-delivery");
        orderRepository.save(order);
    }
}
