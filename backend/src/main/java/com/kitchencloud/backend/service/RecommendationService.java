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

        try {
            // 1. Get User Favorites (if user is logged in)
            if (userId != null) {
                try {
                    List<Long> userFavoriteIds = orderItemRepository.findUserFavoriteItemIds(userId, limit);
                    if (userFavoriteIds != null && !userFavoriteIds.isEmpty()) {
                        List<MenuItem> favorites = menuItemRepository.findAllById(userFavoriteIds);
                        // Filter deleted items
                        for (MenuItem item : favorites) {
                            if (!item.isDeleted()) {
                                recommendations.add(item);
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error fetching user favorites: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            // 2. Fill with Global Popular Items if we don't have enough
            if (recommendations.size() < 10) {
                try {
                    // Increase limit for popular items to finding more candidates
                    Pageable popularLimit = PageRequest.of(0, 50);
                    List<Long> globalPopularIds = orderItemRepository.findGlobalPopularItemIds(popularLimit);
                    
                    if (globalPopularIds != null && !globalPopularIds.isEmpty()) {
                        List<MenuItem> popularItems = menuItemRepository.findAllById(globalPopularIds);
                        
                        // Sort them back by popularity (order of ids) because findAllById might not preserve order
                        // Actually, findAllById doesn't guarantee order. 
                        // To preserve order of 'globalPopularIds', we should map them.
                        // But strictly, we just want to add them.
                        
                        // We need to maintain the order of ID list for popularity
                        java.util.Map<Long, MenuItem> itemMap = new java.util.HashMap<>();
                        for(MenuItem item : popularItems) itemMap.put(item.getId(), item);
                        
                        for(Long id : globalPopularIds) {
                            if (recommendations.size() >= 10) break;
                            MenuItem item = itemMap.get(id);
                            if(item != null && !item.isDeleted()) {
                                recommendations.add(item);
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error fetching global popular items: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            // 3. REMOVED Fallback to "All Items". 
            // We only show items that have actual order history (User or Global).
            // This prevents "Test" items or "My Kitchen" items from appearing unless they are actually ordered.
        } catch (Exception e) {
            System.err.println("Critical error in recommendation service: " + e.getMessage());
            e.printStackTrace();
        }

        return new ArrayList<>(recommendations);
    }
}
