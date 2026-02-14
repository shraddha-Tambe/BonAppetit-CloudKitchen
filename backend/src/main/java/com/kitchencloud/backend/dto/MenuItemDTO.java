package com.kitchencloud.backend.dto;

import lombok.Data;

@Data
public class MenuItemDTO {
    private String name;
    private String description;
    private Double price;
    private boolean isVeg;
    private String imageUrl;
    private String category;
    private boolean available;
    private Long restaurantId;
}
