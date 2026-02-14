package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.DeliveryBoy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryBoyRepository extends JpaRepository<DeliveryBoy, Long> {
    Optional<DeliveryBoy> findByEmail(String email);

    java.util.List<DeliveryBoy> findByApproved(boolean approved);

    long countByApproved(boolean approved);
}
