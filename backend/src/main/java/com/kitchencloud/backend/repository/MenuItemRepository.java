package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(Long restaurantId);

    List<MenuItem> findByDeletedFalse();

    List<MenuItem> findByRestaurantIdAndDeletedFalse(Long restaurantId);
}
