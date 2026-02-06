package com.kitchencloud.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRegisterDTO {
    private String restaurantName;
    private String ownerName;
    private String email;
    private String phone;
    private String password;
    private String cuisineType;
    private String address;
    private String description;
    private String licenseNumber;
    private String imageUrl;
}
