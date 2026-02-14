package com.kitchencloud.backend.repository;

import com.kitchencloud.backend.model.NGO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NGORepository extends JpaRepository<NGO, Long> {
    Optional<NGO> findByEmail(String email);

    java.util.List<NGO> findByApproved(boolean approved);
}
