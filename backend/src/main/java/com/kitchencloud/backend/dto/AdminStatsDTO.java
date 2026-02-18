package com.kitchencloud.backend.dto;

import lombok.Data;

@Data
public class AdminStatsDTO {
    private long totalOrders;
    private long totalUsers;
    private double totalRevenue;
    private long totalRestaurants;
    
    private double weeklyRevenue;
    private long weeklyOrders;
    
    // For charts
    private java.util.Map<String, Long> ordersPerStatus;
    private java.util.Map<String, Long> cuisineData;
    private java.util.List<TopRestaurantDTO> topRestaurants;
    
    @Data
    public static class TopRestaurantDTO {
        private String name;
        private long orders;
        private double revenue;
    }
}
