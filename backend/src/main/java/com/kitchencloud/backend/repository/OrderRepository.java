package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByStatusAndDeliveryBoyIsNull(String status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double calculateTotalRevenue();

    List<Order> findTop5ByOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt >= :startDate")
    Double calculateRevenueSince(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    Long countOrdersSince(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.user.id = :userId")
    Double sumTotalAmountByUserId(Long userId);

    // Top 5 Restaurants by Revenue
    @org.springframework.data.jpa.repository.Query("SELECT r.restaurantName, COUNT(o), SUM(o.totalAmount) FROM Order o JOIN o.restaurant r GROUP BY r.restaurantName ORDER BY SUM(o.totalAmount) DESC")
    List<Object[]> findTopRestaurantsByRevenue(org.springframework.data.domain.Pageable pageable);

    // Orders by Cuisine
    @org.springframework.data.jpa.repository.Query("SELECT r.cuisineType, COUNT(o) FROM Order o JOIN o.restaurant r GROUP BY r.cuisineType")
    List<Object[]> countOrdersByCuisine();

    List<Order> findByDeliveryBoyId(Long deliveryBoyId);
}
