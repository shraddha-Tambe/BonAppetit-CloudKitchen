package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByEmail(String email);

    java.util.List<Restaurant> findByApproved(boolean approved);

    long countByApproved(boolean approved);

    java.util.List<Restaurant> findByRestaurantName(String restaurantName);
}
