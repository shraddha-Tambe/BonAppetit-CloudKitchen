package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.dto.OrderRequestDTO;
import com.kitchencloud.backend.model.*;
import com.kitchencloud.backend.repository.*;
import com.kitchencloud.backend.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    public OrderController() {
        System.out.println("!!! KITCHEN CLOUD BACKEND UPDATED - VERSION 2 !!!");
        System.out.println("!!! KITCHEN CLOUD BACKEND UPDATED - VERSION 2 !!!");
        System.out.println("!!! KITCHEN CLOUD BACKEND UPDATED - VERSION 2 !!!");
    }

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequestDTO request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));

            // 0. Handle Coupon Reuse
            System.out.println("DEBUG: Coupon Code Received: " + request.getCouponCode());
            if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
                String code = request.getCouponCode().trim().toUpperCase();
                System.out.println("DEBUG: User Used Coupons: " + user.getUsedCoupons());
                
                if (user.getUsedCoupons().contains(code)) {
                    System.out.println("DEBUG: Coupon REJECTED (Already Used)");
                    return ResponseEntity.badRequest().body("Coupon '" + code + "' has already been used!");
                }
                user.getUsedCoupons().add(code);
                user = userRepository.save(user); // Persist coupon usage immediately
                System.out.println("DEBUG: Coupon ACCEPTED and Saved. List: " + user.getUsedCoupons());
            } else {
                 System.out.println("DEBUG: No Coupon Code in Request");
            }

            // 1. Handle Point Redemption
            if (request.getRedeemedPoints() != null && request.getRedeemedPoints() > 0) {
                if (user.getLoyaltyPoints() < request.getRedeemedPoints()) {
                    return ResponseEntity.badRequest().body("Insufficient loyalty points");
                }
                user.setLoyaltyPoints(user.getLoyaltyPoints() - request.getRedeemedPoints());
                user = userRepository.save(user); // Capture saved entity
            }

            Order order = new Order();
            order.setUser(user);
            order.setRestaurant(restaurant);
            order.setDeliveryAddress(request.getUserAddress());
            order.setDeliveryPhone(request.getUserPhone());
            order.setTotalAmount(request.getTotal());
            order.setStatus("pending");
            order.setDonationAmount(request.getDonationAmount());
            order.setNgoId(request.getNgoId());
            order.setPaymentId(request.getPaymentId());

            List<OrderItem> orderItems = new ArrayList<>();
            for (OrderRequestDTO.OrderItemRequest itemRequest : request.getItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                        .orElseThrow(() -> new RuntimeException("Menu Item not found"));
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setMenuItem(menuItem);
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setPrice(menuItem.getPrice());
                orderItems.add(orderItem);
            }
            order.setItems(orderItems);

            orderRepository.save(order);

            // Loyalty Program: Award points if ordering from 'My Kitchen' using updated user object
            if ("My Kitchen".equalsIgnoreCase(restaurant.getRestaurantName())) {
                int pointsEarned = (int) (order.getTotalAmount() / 10); // 10% of order value
                if (pointsEarned > 0) {
                    user.setLoyaltyPoints(user.getLoyaltyPoints() + pointsEarned);
                    user = userRepository.save(user); // Capture saved entity again
                }
            }

            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to place order: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'ADMIN')")
    public List<Order> getRestaurantOrders(@PathVariable Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('DELIVERY')")
    public List<Order> getAvailableOrders() {
        return orderRepository.findByStatusAndDeliveryBoyIsNull("ready");
    }

    @GetMapping("/delivery")
    @PreAuthorize("hasRole('DELIVERY')")
    public List<Order> getMyDeliveries(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        DeliveryBoy deliveryBoy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));
        return orderRepository.findByDeliveryBoyId(deliveryBoy.getId());
    }

    @PutMapping("/assign/{orderId}")
    @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<?> assignOrder(@PathVariable Long orderId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        DeliveryBoy deliveryBoy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getDeliveryBoy() != null) {
            return ResponseEntity.badRequest().body("Order already assigned");
        }

        order.setDeliveryBoy(deliveryBoy);
        order.setStatus("out-for-delivery");
        orderRepository.save(order);

        return ResponseEntity.ok("Order assigned successfully");
    }

    @PutMapping("/status/{orderId}")
    @PreAuthorize("hasAnyRole('RESTAURANT', 'DELIVERY', 'ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        orderRepository.save(order);

        return ResponseEntity.ok("Order status updated");
    }
}
