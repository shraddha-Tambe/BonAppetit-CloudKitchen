package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.dto.MenuItemDTO;
import com.kitchencloud.backend.model.MenuItem;
import com.kitchencloud.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS
public class DishController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public List<MenuItem> getAllDishes() {
        System.out.println("GET DISHES API HIT");
        return adminService.getAllDishes();
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addDish(@ModelAttribute MenuItemDTO dto,
            @RequestParam("image") org.springframework.web.multipart.MultipartFile image) {
        System.out.println("ADD DISH API HIT");
        adminService.addDish(dto, image);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dish added successfully");
        return ResponseEntity.ok(response);
    }
}
