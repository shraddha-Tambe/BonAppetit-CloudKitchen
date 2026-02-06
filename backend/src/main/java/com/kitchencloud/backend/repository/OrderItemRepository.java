package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.MenuItem;
import com.kitchencloud.backend.model.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.menuItem FROM OrderItem oi GROUP BY oi.menuItem ORDER BY COUNT(oi) DESC")
    List<MenuItem> findGlobalPopularItems(Pageable pageable);

    @Query("SELECT oi.menuItem FROM OrderItem oi WHERE oi.order.user.id = :userId GROUP BY oi.menuItem ORDER BY COUNT(oi) DESC")
    List<MenuItem> findUserFavoriteItems(@Param("userId") Long userId, Pageable pageable);
}
