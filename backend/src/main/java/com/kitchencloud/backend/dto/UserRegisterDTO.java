package com.kitchencloud.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDTO {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String role;
}
