package com.example.model;

import java.util.Date;

public class Review {
    private String userEmail;
    private String userName; // to display in product detail page who review it
    private int rating; // i set 1 to 5
    private String comment;
    private long timestamp; // to store the date user review

    public Review() {
        this.timestamp = new Date().getTime();
    }

    public Review(String userEmail, String userName, int rating, String comment) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.rating = rating;
        this.comment = comment;
        this.timestamp = new Date().getTime();
    }

    // Getters and Setters
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
