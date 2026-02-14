package com.kitchencloud.backend.service;

import com.kitchencloud.backend.config.JwtUtil;
import com.kitchencloud.backend.dto.*;
import com.kitchencloud.backend.model.DeliveryBoy;
import com.kitchencloud.backend.model.NGO;
import com.kitchencloud.backend.model.Restaurant;
import com.kitchencloud.backend.model.User;
import com.kitchencloud.backend.repository.DeliveryBoyRepository;
import com.kitchencloud.backend.repository.NGORepository;
import com.kitchencloud.backend.repository.RestaurantRepository;
import com.kitchencloud.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.kitchencloud.backend.service.ImageService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ImageService imageService;

    public AuthResponseDTO registerUser(UserRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return new AuthResponseDTO(false, "Email already exists", null, null, null);
        }
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole() != null ? dto.getRole().toUpperCase() : "USER");
        User savedUser = userRepository.save(user);
        return new AuthResponseDTO(true, "User registered successfully", null, user.getRole(), savedUser.getId());
    }

    public AuthResponseDTO registerRestaurant(RestaurantRegisterDTO dto, MultipartFile image) throws IOException {
        if (restaurantRepository.findByEmail(dto.getEmail()).isPresent()) {
            return new AuthResponseDTO(false, "Email already exists", null, null, null);
        }
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantName(dto.getRestaurantName());
        restaurant.setOwnerName(dto.getOwnerName());
        restaurant.setEmail(dto.getEmail());
        restaurant.setPhone(dto.getPhone());
        restaurant.setPassword(passwordEncoder.encode(dto.getPassword()));
        restaurant.setCuisineType(dto.getCuisineType());
        restaurant.setAddress(dto.getAddress());
        restaurant.setDescription(dto.getDescription());
        restaurant.setLicenseNumber(dto.getLicenseNumber());

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageService.saveImage(image);
            restaurant.setImageUrl(imageUrl);
        }

        restaurant.setApproved(false);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return new AuthResponseDTO(true, "Restaurant registered successfully. Wait for approval.", null, "RESTAURANT",
                savedRestaurant.getId());
    }

    public AuthResponseDTO registerDeliveryBoy(DeliveryBoyRegisterDTO dto) {
        if (deliveryBoyRepository.findByEmail(dto.getEmail()).isPresent()) {
            return new AuthResponseDTO(false, "Email already exists", null, null, null);
        }
        DeliveryBoy deliveryBoy = new DeliveryBoy();
        deliveryBoy.setFullName(dto.getFullName());
        deliveryBoy.setEmail(dto.getEmail());
        deliveryBoy.setPhone(dto.getPhone());
        deliveryBoy.setPassword(passwordEncoder.encode(dto.getPassword()));
        deliveryBoy.setVehicleType(dto.getVehicleType());
        deliveryBoy.setDrivingLicenseNumber(dto.getDrivingLicenseNumber());
        deliveryBoy.setApproved(false);
        deliveryBoy.setAvailable(true);
        DeliveryBoy savedDeliveryBoy = deliveryBoyRepository.save(deliveryBoy);
        return new AuthResponseDTO(true, "Delivery Boy registered successfully. Wait for approval.", null, "DELIVERY",
                savedDeliveryBoy.getId());
    }

    public AuthResponseDTO registerNGO(NGORegisterDTO dto, MultipartFile image) throws IOException {
        if (ngoRepository.findByEmail(dto.getEmail()).isPresent()) {
            return new AuthResponseDTO(false, "Email already exists", null, null, null);
        }
        NGO ngo = new NGO();
        ngo.setOrganizationName(dto.getOrganizationName());
        ngo.setType(dto.getType());
        ngo.setCity(dto.getCity());
        ngo.setEmail(dto.getEmail());
        ngo.setContactNumber(dto.getContactNumber());
        ngo.setPassword(passwordEncoder.encode(dto.getPassword()));
        ngo.setDescription(dto.getDescription());

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageService.saveImage(image);
            ngo.setImageUrl(imageUrl);
        }

        ngo.setApproved(false);
        NGO savedNGO = ngoRepository.save(ngo);
        return new AuthResponseDTO(true, "NGO registered successfully. Wait for approval.", null, "NGO",
                savedNGO.getId());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        String role = dto.getRole().toUpperCase();
        String token = null;
        Long id = null;

        try {
            switch (dto.getRole().toUpperCase()) {
                case "USER":
                    User user = userRepository.findByEmail(dto.getEmail())
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                        throw new RuntimeException("Invalid password");
                    }
                    // Use the actual role from the database (e.g., ADMIN or USER)
                    role = user.getRole().toUpperCase();
                    token = jwtUtil.generateToken(user.getEmail(), role, user.getId());
                    id = user.getId();
                    break;

                case "RESTAURANT":
                    Restaurant restaurant = restaurantRepository.findByEmail(dto.getEmail())
                            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
                    if (!passwordEncoder.matches(dto.getPassword(), restaurant.getPassword())) {
                        throw new RuntimeException("Invalid password");
                    }
                    if (!restaurant.isApproved()) {
                        return new AuthResponseDTO(false, "Restaurant not approved yet", null, null,
                                restaurant.getId());
                    }
                    token = jwtUtil.generateToken(restaurant.getEmail(), "RESTAURANT", restaurant.getId());
                    id = restaurant.getId();
                    break;

                case "DELIVERY":
                    DeliveryBoy deliveryBoy = deliveryBoyRepository.findByEmail(dto.getEmail())
                            .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));
                    if (!passwordEncoder.matches(dto.getPassword(), deliveryBoy.getPassword())) {
                        throw new RuntimeException("Invalid password");
                    }
                    if (!deliveryBoy.isApproved()) {
                        return new AuthResponseDTO(false, "Delivery Boy not approved yet", null, null,
                                deliveryBoy.getId());
                    }
                    token = jwtUtil.generateToken(deliveryBoy.getEmail(), "DELIVERY", deliveryBoy.getId());
                    id = deliveryBoy.getId();
                    break;

                case "NGO":
                    NGO ngo = ngoRepository.findByEmail(dto.getEmail())
                            .orElseThrow(() -> new RuntimeException("NGO not found"));
                    if (!passwordEncoder.matches(dto.getPassword(), ngo.getPassword())) {
                        throw new RuntimeException("Invalid password");
                    }
                    if (!ngo.isApproved()) {
                        return new AuthResponseDTO(false, "NGO not approved yet", null, null, ngo.getId());
                    }
                    token = jwtUtil.generateToken(ngo.getEmail(), "NGO", ngo.getId());
                    id = ngo.getId();
                    break;

                default:
                    return new AuthResponseDTO(false, "Invalid role", null, null, null);
            }
        } catch (RuntimeException e) {
            return new AuthResponseDTO(false, e.getMessage(), null, null, null);
        }

        return new AuthResponseDTO(true, "Login successful", token, role, id);
    }
}
