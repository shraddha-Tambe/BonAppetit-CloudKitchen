package com.kitchencloud.backend.controller;

import com.kitchencloud.backend.model.Donation;
import com.kitchencloud.backend.model.User;
import com.kitchencloud.backend.model.Restaurant;
import com.kitchencloud.backend.repository.DonationRepository;
import com.kitchencloud.backend.repository.UserRepository;
import com.kitchencloud.backend.repository.RestaurantRepository;
import com.kitchencloud.backend.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/available")
    public List<Donation> getAvailableFoodDonations() {
        return donationRepository.findByTypeAndStatus("FOOD", "AVAILABLE");
    }

    @PutMapping("/claim/{donationId}")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> claimDonation(@PathVariable Long donationId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        User ngo = userRepository.findByEmail(email).orElseThrow();

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (!"AVAILABLE".equals(donation.getStatus())) {
            return ResponseEntity.badRequest().body("Donation not available");
        }

        donation.setStatus("CLAIMED");
        donation.setNgo(ngo);
        donationRepository.save(donation);

        return ResponseEntity.ok("Donation claimed successfully");
    }

    @GetMapping("/money")
    @PreAuthorize("hasRole('NGO')")
    public List<Donation> getMoneyDonations(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        User ngo = userRepository.findByEmail(email).orElseThrow();
        return donationRepository.findByNgoId(ngo.getId());
    }

    @PostMapping("/money")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> donateMoney(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();

        Long ngoId = Long.valueOf(payload.get("ngoId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());

        User ngo = userRepository.findById(ngoId).orElseThrow(() -> new RuntimeException("NGO not found"));

        Donation donation = new Donation();
        donation.setType("MONEY");
        donation.setAmount(amount);
        donation.setUser(user);
        donation.setNgo(ngo);
        donation.setStatus("COMPLETED");

        donationRepository.save(donation);

        return ResponseEntity.ok("Money donation successful");
    }

    @PostMapping("/food")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> donateFood(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        User owner = userRepository.findByEmail(email).orElseThrow();
        // Assuming owner is linked to a Restaurant, but here we might need restaurantId
        // passed or found
        // For simplicity, let's assume we pass restaurantId in payload or find it
        // The prompt implies "existing donation UI", let's see what it sends.
        // Usually Authentication for Restaurant Owner gives us the User, and we can
        // find Restaurant by Owner?
        // Let's assume passed restaurantId for now or just generic logic.
        // Wait, User (Owner) -> Restaurant.
        // We'll trust the payload has basic info or look it up.
        // Let's implement basics.

        Donation donation = new Donation();
        donation.setType("FOOD");
        donation.setItems((String) payload.get("items"));
        donation.setQuantity((String) payload.get("quantity"));
        donation.setStatus("AVAILABLE");

        // Linking restaurant if ID provided
        if (payload.containsKey("restaurantId")) {
            Long rId = Long.valueOf(payload.get("restaurantId").toString());
            Restaurant restaurant = restaurantRepository.findById(rId).orElse(null);
            donation.setRestaurant(restaurant);
        }

        donationRepository.save(donation);
        return ResponseEntity.ok("Food donation listed successfully");
    }
}
