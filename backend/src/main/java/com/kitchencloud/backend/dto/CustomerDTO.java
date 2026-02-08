package com.kitchencloud.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private Long ordersCount;
    private Double totalSpent;
    private String status;
    private int loyaltyPoints;
}
