package com.example.model;

import org.bson.types.ObjectId;

public class User {
    private ObjectId id;
    private String user_fname; // User First Name
    private String user_lname; // User Last Name
    private String password; // Password of each user
    private String email;
    private String address;
    private String role;

    public User() {
    }

    public User(String user_fname, String user_lname, String password, String email, String address,
            String role) {
        this.user_fname = user_fname;
        this.user_lname = user_lname;
        this.password = password;
        this.email = email;
        this.address = address;
        this.role = role;
    }

    // Setter and Getter Functions
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUser_fname() {
        return user_fname;
    }

    public void setUser_fname(String user_fname) {
        this.user_fname = user_fname;
    }

    public String getUser_lname() {
        return user_lname;
    }

    public void setUser_lname(String user_lname) {
        this.user_lname = user_lname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}