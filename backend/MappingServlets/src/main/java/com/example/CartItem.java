package com.example;

import java.util.List;

public class CartItem {
    //Declare variables neede for the cart
    private String productId;
    private String productName;
    private double price;
    private int quantity;
    private List<String> images; 

    public CartItem() {}

    public CartItem(String productId, String productName, double price, int quantity, List<String> images ) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.images = images;
    }

    // Getters and Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    
    //Helper function to calculate the final price of each item
    public double getTotalPrice() {
        return this.price * this.quantity;
    }
}