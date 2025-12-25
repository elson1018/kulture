package com.example.servlet;

import com.google.gson.Gson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.example.util.MongoDBUtil;
import com.example.model.Booking;
import com.example.model.Tutorial;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/api/bookings")
public class BookingServlet extends HttpServlet {
    private final Gson gson = new Gson();

    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp);
        String email = req.getParameter("email");

        try {
            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Booking> collection = db.getCollection("bookings", Booking.class);

            List<Booking> userBookings = new ArrayList<>();
            if (email != null && !email.isEmpty()) {
                collection.find(Filters.eq("userEmail", email)).into(userBookings);
            }

            resp.getWriter().write(gson.toJson(userBookings));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp);
        try {
            // Read JSON body and fetch tutorial details before saving
            String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Booking requestData = gson.fromJson(body, Booking.class);

            MongoDatabase db = MongoDBUtil.getDatabase();

            // Get Tutorial details to "join" the data
            MongoCollection<Tutorial> tutorialCol = db.getCollection("tutorials", Tutorial.class);
            Tutorial tutorial = tutorialCol.find(Filters.eq("_id", requestData.getTutorialId())).first();

            if (tutorial == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\":\"Tutorial not found\"}");
                return;
            }

            // Create and insert the enriched Booking
            MongoCollection<Booking> bookingCol = db.getCollection("bookings", Booking.class);
            Booking newBooking = new Booking(
                    requestData.getUserEmail(),
                    requestData.getTutorialId(),
                    new Date(),
                    requestData.getStatus(),
                    tutorial.getName(),
                    tutorial.getPrice(),
                    requestData.getScheduledDate());

            bookingCol.insertOne(newBooking);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\":\"Booking created\"}");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}