package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.model.MenuItem;
import com.kitchencloud.backend.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173") // Adjust port if needed, usually 5173 for Vite
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<MenuItem>> getRecommendations(@PathVariable Long userId) {
        List<MenuItem> recommendations = recommendationService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
}
