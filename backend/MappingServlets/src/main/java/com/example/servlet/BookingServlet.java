package com.example;

import com.google.gson.Gson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.types.ObjectId;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
        String userIdStr = req.getParameter("userId");

        try {
            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Booking> collection = db.getCollection("bookings", Booking.class);

            List<Booking> userBookings = new ArrayList<>();
            if (userIdStr != null) {
                collection.find(Filters.eq("userId", new ObjectId(userIdStr))).into(userBookings);
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
            // Read from request body or parameters
            String userId = req.getParameter("userId");
            String tutorialId = req.getParameter("tutorialId");
            String status = req.getParameter("status");

            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Booking> collection = db.getCollection("bookings", Booking.class);

            Booking newBooking = new Booking(
                    new ObjectId(userId),
                    new ObjectId(tutorialId),
                    new Date(),
                    status != null ? status : "Purchased"
            );

            collection.insertOne(newBooking);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\":\"Booking created\"}");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}