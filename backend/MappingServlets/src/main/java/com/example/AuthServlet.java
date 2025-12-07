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
import static com.mongodb.client.model.Filters.eq;

@WebServlet("/api/auth/*") 
public class AuthServlet extends HttpServlet {

    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp);
        resp.setContentType("application/json");
        
        String path = req.getPathInfo(); 
        MongoDatabase db = MongoDBUtil.getDatabase();
        Gson gson = new Gson();
        // Register
        if ("/register".equals(path)) {
            String role = req.getParameter("role");
            String email = req.getParameter("email");
            String username = req.getParameter("username");
            String password = req.getParameter("password");
            String address = req.getParameter("address");
            // Admin
            if ("admin".equals(role)) {
                // Hold on first
                return;
            }
            // Supplier
            if ("supplier".equals(role)) {
                MongoCollection<Supplier> suppliers = db.getCollection("suppliers", Supplier.class);
                
                if (suppliers.find(eq("email", email)).first() != null) {
                    sendError(resp, "Email address is already registered as a supplier.");
                    return;
                }

                String companyName = req.getParameter("companyName");

                Supplier newSupplier = new Supplier(
                    username,
                    password,
                    email,
                    companyName,
                    address
                );
                suppliers.insertOne(newSupplier);
                
                resp.getWriter().write("{\"status\":\"success\", \"message\":\"Supplier registered!\"}");
            } 
            // User
            else {
                MongoCollection<User> users = db.getCollection("users", User.class);
                
                if (users.find(eq("email", email)).first() != null) {
                    sendError(resp, "Email address is already registered.");
                    return;
                }

                String fname = req.getParameter("fname");
                String lname = req.getParameter("lname");

                User newUser = new User(
                    fname,
                    lname,
                    username,
                    password,
                    email,
                    address
                );
                users.insertOne(newUser);
                
                resp.getWriter().write("{\"status\":\"success\", \"message\":\"User registered!\"}");
            }
        } 
        // Log in
        else if ("/login".equals(path)) {
            String email = req.getParameter("email"); // Assuming login is via email now
            String password = req.getParameter("password");
            
            // Supplier
            MongoCollection<Supplier> suppliers = db.getCollection("suppliers", Supplier.class);
            Supplier supplier = suppliers.find(eq("email", email)).first();
            if (supplier != null && supplier.getPassword().equals(password)) {
                resp.getWriter().write("{\"status\":\"success\", \"role\":\"supplier\", \"user\": " + gson.toJson(supplier) + "}");
                return;
            }

            // User
            MongoCollection<User> users = db.getCollection("users", User.class);
            User user = users.find(eq("email", email)).first();
            if (user != null && user.getPassword().equals(password)) {
                resp.getWriter().write("{\"status\":\"success\", \"role\":\"user\", \"user\": " + gson.toJson(user) + "}");
                return;
            }

            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            sendError(resp, "Invalid email or password");
        }
    }

    private void sendError(HttpServletResponse resp, String msg) throws IOException {
        resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + msg + "\"}");
    }
}