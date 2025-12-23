package com.example.servlet;

import com.google.gson.Gson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.example.util.MongoDBUtil;
import com.example.model.Tutorial;
import com.mongodb.client.model.Filters;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@WebServlet("/api/tutorials")
public class TutorialServlet extends HttpServlet {
    private final Gson gson = new Gson();

    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Aligned with your frontend port
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
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Tutorial> collection = db.getCollection("products", Tutorial.class);

            List<Tutorial> tutorials = new ArrayList<>();
            collection.find(Filters.eq("category", "Tutorials")).into(tutorials);

            resp.getWriter().write(gson.toJson(tutorials));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            // Read from parameters or request body
            String name = req.getParameter("name");
            String instructor = req.getParameter("instructor");
            String desc = req.getParameter("description");
            String priceStr = req.getParameter("price");
            String isLiveClassStr = req.getParameter("isLiveClass");
            String imagesParam = req.getParameter("images");

            double price = (priceStr != null && !priceStr.isEmpty()) ? Double.parseDouble(priceStr) : 0.0;
            boolean isLiveClass = Boolean.parseBoolean(isLiveClassStr);
            List<String> images = (imagesParam != null && !imagesParam.isEmpty())
                    ? Arrays.asList(imagesParam.split(","))
                    : new ArrayList<>();

            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Tutorial> collection = db.getCollection("tutorials", Tutorial.class);

            Tutorial newTutorial = new Tutorial(name, instructor, price, desc, isLiveClass, images);
            collection.insertOne(newTutorial);

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"status\":\"success\", \"id\":\"" + newTutorial.getId().toString() + "\"}");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }
}