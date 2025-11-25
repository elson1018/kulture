package com.example;

import org.bson.types.ObjectId;

public class Supplier {
    private ObjectId id;
    private String username;
    private String password;
    private String email;
    private String companyName;
    private String address;

    public Supplier() {}

    public Supplier(String username, String password, String email, String companyName, String address) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.companyName = companyName;
        this.address = address;
    }

    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}