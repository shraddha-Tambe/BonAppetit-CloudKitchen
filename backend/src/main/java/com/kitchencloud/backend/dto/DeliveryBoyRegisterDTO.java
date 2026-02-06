package com.kitchencloud.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryBoyRegisterDTO {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String vehicleType;
    private String drivingLicenseNumber;
}
