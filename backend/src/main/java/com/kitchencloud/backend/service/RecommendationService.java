package com.kitchencloud.backend.service;

import com.kitchencloud.backend.model.MenuItem;
import com.kitchencloud.backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private com.kitchencloud.backend.repository.MenuItemRepository menuItemRepository;

    public List<MenuItem> getRecommendations(Long userId) {
        Set<MenuItem> recommendations = new LinkedHashSet<>();
        Pageable limit = PageRequest.of(0, 10);

        // 1. Get User Favorites (if user is logged in)
        if (userId != null) {
            List<MenuItem> userFavorites = orderItemRepository.findUserFavoriteItems(userId, limit);
            if (userFavorites != null) {
                recommendations.addAll(userFavorites);
            }
        }

        // 2. Fill with Global Popular Items if we don't have enough
        if (recommendations.size() < 10) {
            List<MenuItem> globalPopular = orderItemRepository.findGlobalPopularItems(limit);
            if (globalPopular != null) {
                for (MenuItem item : globalPopular) {
                    if (recommendations.size() >= 10)
                        break;
                    recommendations.add(item);
                }
            }
        }

        // 3. Last Resort: Fill with ANY available items (Random/Default)
        if (recommendations.size() < 10) {
            // Check if we have any items at all in the system
            List<MenuItem> allItems = menuItemRepository.findAll(limit).getContent();
            for (MenuItem item : allItems) {
                if (recommendations.size() >= 10)
                    break;
                recommendations.add(item);
            }
        }

        return new ArrayList<>(recommendations);
    }
}
