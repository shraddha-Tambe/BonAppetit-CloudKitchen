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

    List<Order> findByDeliveryBoyId(Long deliveryBoyId);
}
