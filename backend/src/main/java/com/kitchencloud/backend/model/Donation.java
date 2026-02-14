package com.kitchencloud.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // FOOD, MONEY

    // For Money Donation
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Donor

    // For Food Donation
    private String items;
    private String quantity;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant; // Donor (Food)

    // Common
    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private User ngo; // Recipient

    private String status; // AVAILABLE, CLAIMED, COMPLETED

    @CreationTimestamp
    private LocalDateTime createdAt;
}
