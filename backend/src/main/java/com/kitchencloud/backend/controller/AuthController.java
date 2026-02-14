package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.dto.*;
import com.kitchencloud.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/user")
    public ResponseEntity<AuthResponseDTO> registerUser(@RequestBody UserRegisterDTO dto) {
        return ResponseEntity.ok(authService.registerUser(dto));
    }

    @PostMapping(value = "/register/restaurant", consumes = "multipart/form-data")
    public ResponseEntity<AuthResponseDTO> registerRestaurant(
            @ModelAttribute RestaurantRegisterDTO dto,
            @RequestParam("image") MultipartFile image) throws java.io.IOException {
        return ResponseEntity.ok(authService.registerRestaurant(dto, image));
    }

    @PostMapping("/register/delivery")
    public ResponseEntity<AuthResponseDTO> registerDeliveryBoy(@RequestBody DeliveryBoyRegisterDTO dto) {
        return ResponseEntity.ok(authService.registerDeliveryBoy(dto));
    }

    @PostMapping(value = "/register/ngo", consumes = "multipart/form-data")
    public ResponseEntity<AuthResponseDTO> registerNGO(
            @ModelAttribute NGORegisterDTO dto,
            @RequestParam("image") MultipartFile image) throws java.io.IOException {
        return ResponseEntity.ok(authService.registerNGO(dto, image));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
