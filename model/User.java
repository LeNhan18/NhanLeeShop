package com.nhanlee.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Address address;
    private String role = "user";
    private List<CartItem> cart;
    private List<String> wishlist;
    
    @Data
    public static class Address {
        private String street;
        private String city;
        private String district;
        private String country;
    }
    
    @Data
    public static class CartItem {
        private String productId;
        private Integer quantity;
        private Double price;
    }
} 