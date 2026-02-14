package com.kitchencloud.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    private Long userId;
    private String userName; // Optional, can use from token
    private String userPhone;
    private String userAddress;

    private Long restaurantId;

    private List<OrderItemRequest> items;

    private Double subtotal;
    private Double tax;
    private Double deliveryCharge;
    private Double discount;
    private Double total;

    private Double donationAmount;
    private String ngoId;
    private String paymentId;
    
    @com.fasterxml.jackson.annotation.JsonProperty("couponCode")
    private String couponCode;

    @com.fasterxml.jackson.annotation.JsonProperty("redeemedPoints")
    private Integer redeemedPoints;

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public Integer getRedeemedPoints() { return redeemedPoints; }
    public void setRedeemedPoints(Integer redeemedPoints) { this.redeemedPoints = redeemedPoints; }

    @Data
    public static class OrderItemRequest {
        private Long menuItemId;
        private Integer quantity;
    }
}
