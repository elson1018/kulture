package com.example;

import com.google.gson.Gson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.bson.types.ObjectId;
import static com.mongodb.client.model.Filters.eq;

@WebServlet("/api/products")
public class ProductServlet extends HttpServlet {

    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Product> collection = db.getCollection("products", Product.class);

            List<Product> products = new ArrayList<>();
            collection.find().into(products);

            String json = new Gson().toJson(products);
            resp.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"Failed to load products\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            String name = req.getParameter("name");
            String category = req.getParameter("category");
            String desc = req.getParameter("description");

            String company = req.getParameter("company"); // I added Company here

            String priceStr = req.getParameter("price");
            double price = 0.0;
            if (priceStr != null && !priceStr.isEmpty()) {
                price = Double.parseDouble(priceStr);
            }

            String imagesParam = req.getParameter("images");
            List<String> images = new ArrayList<>();

            if (imagesParam != null && !imagesParam.isEmpty()) {
                if (imagesParam.startsWith("data:image")) {
                    images.add(imagesParam);
                } else {
                    images = Arrays.asList(imagesParam.split(","));
                }
            }

            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Product> collection = db.getCollection("products", Product.class);

            Product newProduct = new Product(name, category, price, desc, images, company);

            collection.insertOne(newProduct);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"status\":\"success\", \"id\":\"" + newProduct.getId().toString() + "\"}");

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp);
        
        String idParam = req.getParameter("id");

        if (idParam == null || idParam.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"Missing ID parameter\"}");
            return;
        }

        try {
            MongoDatabase db = MongoDBUtil.getDatabase();
            MongoCollection<Product> collection = db.getCollection("products", Product.class);

            collection.deleteOne(eq("_id", new ObjectId(idParam)));

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"status\":\"success\", \"message\":\"Product deleted\"}");

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"Failed to delete product\"}");
        }
    }
}