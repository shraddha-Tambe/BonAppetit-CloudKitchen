package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByTypeAndStatus(String type, String status);

    List<Donation> findByNgoId(Long ngoId);

    List<Donation> findByUserId(Long userId);

    List<Donation> findByRestaurantId(Long restaurantId);

    List<Donation> findByStatus(String status);
}
