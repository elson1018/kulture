
package com.example.servlet;

import com.google.gson.Gson;

import com.example.dao.UserDAO;
import com.example.model.User;
import com.example.util.CorsConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private UserDAO userDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        super.init();
        this.gson = new Gson();
        this.userDAO = new UserDAO();

    }
    // CORS Setup

    private void setupCORS(HttpServletResponse resp, HttpServletRequest req) {
        CorsConfig.setupCORS(resp, req);
    }

    // Override available doOptions to set the CORS headers for preflight requests
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp, req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // Handle different authentication requests
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp, req);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String path = req.getPathInfo();

        if ("/register".equals(path)) {
            handleRegister(req, resp);
        } else if ("/login".equals(path)) {
            handleLogin(req, resp);
        } else if ("/logout".equals(path)) {
            handleLogout(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(Map.of("error", "Invalid Endpoint")));
        }
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        User newUser = gson.fromJson(req.getReader(), User.class);

        if (userDAO.findByEmail(newUser.getEmail()) != null) {
            sendError(resp, "Email address is already registered.");
            return;
        }

        // 3. Set Role (Default to CUSTOMER if missing)
        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("CUSTOMER");
        }

        // 4. Save using DAO
        userDAO.createUser(newUser);

        // 5. Success Response
        Map<String, String> success = new HashMap<>();
        success.put("status", "success");
        success.put("message", "User registered successfully as " + newUser.getRole());
        resp.getWriter().write(gson.toJson(success));
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        User loginRequest = gson.fromJson(req.getReader(), User.class);

        User user = userDAO.findByEmail(loginRequest.getEmail());

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {

            // Create Session
            HttpSession session = req.getSession();
            session.setAttribute("user_id", user.getId().toString());
            session.setAttribute("email", user.getEmail());
            session.setAttribute("role", user.getRole());

            // MANUAL COOKIE FIX FOR CROSS-ORIGIN (VERCEL <-> RAILWAY)
            // Tomcat by default doesn't set SameSite=None, which is required for cross-site
            // cookies.
            String sessionCookie = "JSESSIONID=" + session.getId() + "; Path=/; HttpOnly; Secure; SameSite=None";
            resp.addHeader("Set-Cookie", sessionCookie);

            // Send success JSON
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("status", "success");
            responseData.put("role", user.getRole());

            // Hide password before sending back
            user.setPassword(null);
            responseData.put("user", user);

            resp.getWriter().write(gson.toJson(responseData));
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            sendError(resp, "Invalid email or password");
        }
    }

    // --- 3. LOGOUT LOGIC ---
    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        resp.getWriter().write(gson.toJson(Map.of("message", "Logged out")));
    }

    private void sendError(HttpServletResponse resp, String msg) throws IOException {
        resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + msg + "\"}");
    }
}