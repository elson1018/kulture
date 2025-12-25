package com.example.dao;

import com.example.model.Booking;
import com.example.util.MongoDBUtil;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import java.util.ArrayList;
import java.util.List;

public class BookingDAO {
    private final MongoCollection<Booking> bookingCollection;

    public BookingDAO() {
        MongoDatabase db = MongoDBUtil.getDatabase();
        this.bookingCollection = db.getCollection("bookings", Booking.class);
    }

    public void createBooking(Booking booking) {
        bookingCollection.insertOne(booking);
    }

    public List<Booking> getBookingsByEmail(String email) {
        List<Booking> bookings = new ArrayList<>();
        if (email != null && !email.isEmpty()) {
            bookingCollection.find(Filters.eq("userEmail", email)).into(bookings);
        }
        return bookings;
    }
}
