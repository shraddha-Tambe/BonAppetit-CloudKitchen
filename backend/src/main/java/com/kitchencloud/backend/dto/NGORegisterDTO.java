package com.kitchencloud.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NGORegisterDTO {
    private String organizationName;
    private String type;
    private String city;
    private String email;
    private String contactNumber;
    private String password;
    private String description;
    private String imageUrl;
}
