package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.dto.MenuItemDTO;
import com.kitchencloud.backend.model.MenuItem;
import com.kitchencloud.backend.model.Restaurant;
import com.kitchencloud.backend.repository.MenuItemRepository;
import com.kitchencloud.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private com.kitchencloud.backend.service.FileStorageService fileStorageService;

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuByRestaurant(@PathVariable Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndDeletedFalse(restaurantId);
    }

    @GetMapping("/featured")
    public List<MenuItem> getFeaturedItems() {
        System.out.println("DEBUG: /featured endpoint called");
        // Fetch dishes from "My Kitchen"
        List<Restaurant> restaurants = restaurantRepository.findByRestaurantName("My Kitchen");
        System.out.println("DEBUG: Found " + restaurants.size() + " restaurants with name 'My Kitchen'");

        Restaurant myKitchen = restaurants.stream().findFirst().orElse(null);

        if (myKitchen != null) {
            System.out.println("DEBUG: Using Restaurant ID: " + myKitchen.getId());
            List<MenuItem> items = menuItemRepository.findByRestaurantIdAndDeletedFalse(myKitchen.getId());
            System.out.println("DEBUG: Found " + items.size() + " menu items for restaurant " + myKitchen.getId());
            return items;
        } else {
            System.out.println("DEBUG: 'My Kitchen' restaurant not found!");
        }
        return List.of();
    }

    @PostMapping(value = "/add", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> addMenuItem(@ModelAttribute MenuItemDTO dto,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        try {
            System.out.println("DEBUG: addMenuItem called");
            System.out.println("DEBUG: Restaurant ID: " + dto.getRestaurantId());
            System.out.println("DEBUG: Name: " + dto.getName());

            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + dto.getRestaurantId()));

            MenuItem item = new MenuItem();
            item.setName(dto.getName());
            item.setDescription(dto.getDescription());
            item.setPrice(dto.getPrice());
            item.setVeg(dto.isVeg());
            item.setCategory(dto.getCategory());
            item.setAvailable(dto.isAvailable());

            if (image != null && !image.isEmpty()) {
                System.out.println("DEBUG: Image received: " + image.getOriginalFilename());
                String fileName = fileStorageService.storeFile(image);
                item.setImageUrl(fileName);
            } else {
                System.out.println("DEBUG: No image received");
            }

            item.setRestaurant(restaurant);

            menuItemRepository.save(item);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Menu item added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding menu item: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id,
            @ModelAttribute MenuItemDTO dto,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setVeg(dto.isVeg());
        item.setCategory(dto.getCategory());
        item.setAvailable(dto.isAvailable());

        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            item.setImageUrl(fileName);
        }

        menuItemRepository.save(item);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Menu item updated successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Menu item deleted successfully");
        return ResponseEntity.ok(response);
    }
}
