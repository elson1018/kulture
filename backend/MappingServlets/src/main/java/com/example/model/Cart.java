package com.example.model;

import com.example.model.CartItem;

import org.bson.types.ObjectId;
import java.util.ArrayList;
import java.util.List;

public class Cart {

    private ObjectId id; // The unique ID of this Cart document
    private String userId; // Links this cart to a specific User
    private List<CartItem> items;

    public Cart() {
        this.items = new ArrayList<>();
    }

    public Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
    }

    // Getters and Setters
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    // Helper to get the grand total of the whole cart
    public double getCartGrandTotal() {
        double total = 0;
        if (items != null) {
            for (CartItem item : items) {
                total += item.getTotalPrice();
            }
        }
        return total;
    }
}