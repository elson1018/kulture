package com.example.model;

import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import java.util.Date;
import java.util.List;

public class Sale {
    @BsonId
    private ObjectId id;
    private String customerEmail;
    private List<String> productNames;
    private double totalAmount;
    private Date saleDate;
    private String company;

    public Sale() {
        this.saleDate = new Date();
    }

    // Getters and Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String email) { this.customerEmail = email; }
    public List<String> getProductNames() { return productNames; }
    public void setProductNames(List<String> names) { this.productNames = names; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double amount) { this.totalAmount = amount; }
    public Date getSaleDate() { return saleDate; }
    public void setSaleDate(Date date) { this.saleDate = date; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
}