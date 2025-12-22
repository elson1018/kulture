package com.example;

import org.bson.types.ObjectId;
import java.util.Date;

public class Booking {
    private ObjectId id;
    private ObjectId userId;
    private ObjectId tutorialId;
    private Date bookingDate;
    private String status;

    public Booking() {}

    public Booking(ObjectId userId, ObjectId tutorialId, Date bookingDate, String status) {
        this.userId = userId;
        this.tutorialId = tutorialId;
        this.bookingDate = bookingDate;
        this.status = status;
    }

    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }
    public ObjectId getUserId() { return userId; }
    public void setUserId(ObjectId userId) { this.userId = userId; }
    public ObjectId getTutorialId() { return tutorialId; }
    public void setTutorialId(ObjectId tutorialId) { this.tutorialId = tutorialId; }
    public Date getBookingDate() { return bookingDate; }
    public void setBookingDate(Date bookingDate) { this.bookingDate = bookingDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}