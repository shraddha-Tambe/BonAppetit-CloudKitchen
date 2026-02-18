package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/restaurants")
    public ResponseEntity<?> getAllRestaurants() {
        return ResponseEntity.ok(adminService.getAllRestaurants());
    }

    @GetMapping("/restaurants/pending")
    public ResponseEntity<?> getPendingRestaurants() {
        return ResponseEntity.ok(adminService.getPendingRestaurants());
    }

    @DeleteMapping("/restaurants/delete/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id) {
        adminService.deleteRestaurant(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Restaurant deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/delivery")
    public ResponseEntity<?> getAllDeliveryBoys() {
        return ResponseEntity.ok(adminService.getAllDeliveryBoys());
    }

    @GetMapping("/delivery/pending")
    public ResponseEntity<?> getPendingDeliveryBoys() {
        return ResponseEntity.ok(adminService.getPendingDeliveryBoys());
    }

    @GetMapping("/ngos")
    public ResponseEntity<?> getAllNGOs() {
        return ResponseEntity.ok(adminService.getAllNGOs());
    }

    @GetMapping("/ngos/pending")
    public ResponseEntity<?> getPendingNGOs() {
        return ResponseEntity.ok(adminService.getPendingNGOs());
    }

    @GetMapping("/ngos/approved")
    public ResponseEntity<?> getApprovedNGOs() {
        return ResponseEntity.ok(adminService.getApprovedNGOs());
    }

    @GetMapping("/dishes")
    public ResponseEntity<?> getAllDishes() {
        return ResponseEntity.ok(adminService.getAllDishes());
    }

    @PostMapping(value = "/dishes/add", consumes = "multipart/form-data")
    public ResponseEntity<?> addDish(@ModelAttribute com.kitchencloud.backend.dto.MenuItemDTO dto,
            @RequestParam("image") org.springframework.web.multipart.MultipartFile image) {
        adminService.addDish(dto, image);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dish added successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/dishes/update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateDish(@PathVariable Long id,
            @ModelAttribute com.kitchencloud.backend.dto.MenuItemDTO dto,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        adminService.updateDish(id, dto, image);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dish updated successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/dishes/delete/{id}")
    public ResponseEntity<?> deleteDish(@PathVariable Long id) {
        adminService.deleteDish(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dish deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/approve/restaurant/{id}")
    public ResponseEntity<?> approveRestaurant(@PathVariable Long id) {
        adminService.approveRestaurant(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Restaurant approved successfully"));
    }

    @PutMapping("/reject/restaurant/{id}")
    public ResponseEntity<?> rejectRestaurant(@PathVariable Long id) {
        adminService.rejectRestaurant(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Restaurant rejected successfully"));
    }

    @PutMapping("/approve/delivery/{id}")
    public ResponseEntity<?> approveDeliveryBoy(@PathVariable Long id) {
        adminService.approveDeliveryBoy(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Delivery Boy approved successfully"));
    }

    @PutMapping("/reject/delivery/{id}")
    public ResponseEntity<?> rejectDeliveryBoy(@PathVariable Long id) {
        adminService.rejectDeliveryBoy(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Delivery Boy rejected successfully"));
    }

    @PutMapping("/approve/ngo/{id}")
    public ResponseEntity<?> approveNGO(@PathVariable Long id) {
        adminService.approveNGO(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "NGO approved successfully"));
    }

    @PutMapping("/reject/ngo/{id}")
    public ResponseEntity<?> rejectNGO(@PathVariable Long id) {
        adminService.rejectNGO(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "NGO rejected successfully"));
    }

    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/orders/recent")
    public ResponseEntity<?> getRecentOrders() {
        return ResponseEntity.ok(adminService.getRecentOrders());
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PutMapping("/orders/assign/{orderId}")
    public ResponseEntity<?> assignDeliveryBoy(@PathVariable Long orderId, @RequestParam Long deliveryBoyId) {
        adminService.assignDeliveryBoyToOrder(orderId, deliveryBoyId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Delivery Boy assigned successfully"));
    }
}
