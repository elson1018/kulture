package com.example;

import org.bson.types.ObjectId;
import java.util.Date;

public class Booking {
    private ObjectId id;
    private String userEmail;
    private ObjectId tutorialId;
    private Date bookingDate;
    private String status;
    private String scheduledDate;
    private String tutorialName;
    private double price;

    public Booking() {}

    public Booking(String userEmail, ObjectId tutorialId, Date bookingDate, String status, String tutorialName, double price, String scheduledDate) {
        this.userEmail = userEmail;
        this.tutorialId = tutorialId;
        this.bookingDate = bookingDate;
        this.status = status;
        this.tutorialName = tutorialName;
        this.price = price;
        this.scheduledDate = scheduledDate;
    }

    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public ObjectId getTutorialId() { return tutorialId; }
    public void setTutorialId(ObjectId tutorialId) { this.tutorialId = tutorialId; }
    public Date getBookingDate() { return bookingDate; }
    public void setBookingDate(Date bookingDate) { this.bookingDate = bookingDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }
    public String getTutorialName() { return tutorialName; }
    public void setTutorialName(String tutorialName) { this.tutorialName = tutorialName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}