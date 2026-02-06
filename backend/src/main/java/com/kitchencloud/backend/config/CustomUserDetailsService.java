package com.kitchencloud.backend.config;

import com.kitchencloud.backend.model.User;
import com.kitchencloud.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private com.kitchencloud.backend.repository.RestaurantRepository restaurantRepository;

        @Autowired
        private com.kitchencloud.backend.repository.DeliveryBoyRepository deliveryBoyRepository;

        @Autowired
        private com.kitchencloud.backend.repository.NGORepository ngoRepository;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                // Check User
                java.util.Optional<User> user = userRepository.findByEmail(email);
                if (user.isPresent()) {
                        return new org.springframework.security.core.userdetails.User(user.get().getEmail(),
                                        user.get().getPassword(),
                                        Collections.singletonList(
                                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_" + user.get().getRole())));
                }

                // Check Restaurant
                java.util.Optional<com.kitchencloud.backend.model.Restaurant> restaurant = restaurantRepository
                                .findByEmail(email);
                if (restaurant.isPresent()) {
                        return new org.springframework.security.core.userdetails.User(restaurant.get().getEmail(),
                                        restaurant.get().getPassword(),
                                        Collections.singletonList(
                                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_RESTAURANT")));
                }

                // Check Delivery Boy
                java.util.Optional<com.kitchencloud.backend.model.DeliveryBoy> deliveryBoy = deliveryBoyRepository
                                .findByEmail(email);
                if (deliveryBoy.isPresent()) {
                        return new org.springframework.security.core.userdetails.User(deliveryBoy.get().getEmail(),
                                        deliveryBoy.get().getPassword(),
                                        Collections.singletonList(
                                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_DELIVERY")));
                }

                // Check NGO
                java.util.Optional<com.kitchencloud.backend.model.NGO> ngo = ngoRepository.findByEmail(email);
                if (ngo.isPresent()) {
                        return new org.springframework.security.core.userdetails.User(ngo.get().getEmail(),
                                        ngo.get().getPassword(),
                                        Collections.singletonList(
                                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_NGO")));
                }

                throw new UsernameNotFoundException("User not found with email: " + email);
        }
}
