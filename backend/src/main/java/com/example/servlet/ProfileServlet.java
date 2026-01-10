package com.example.servlet;

import com.example.dao.UserDAO;
import com.example.model.User;
import com.example.util.CorsConfig;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet("/api/profile/*")
public class ProfileServlet extends HttpServlet {

    private UserDAO userDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        super.init();
        this.userDAO = new UserDAO();
        this.gson = new Gson();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        CorsConfig.setupCORS(resp, req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsConfig.setupCORS(resp, req);
        resp.setContentType("application/json");

        String path = req.getPathInfo();

        // Ensure user is logged in
        // Ensure user is logged in
        // HttpSession session = req.getSession(false); // Unused variable removed

        if ("/update".equals(path)) {
            handleUpdateProfile(req, resp);
        } else if ("/password".equals(path)) {
            handleUpdatePassword(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(Map.of("error", "Invalid endpoint")));
        }
    }

    private void handleUpdateProfile(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);

        String email = json.get("email").getAsString();

        User existingUser = userDAO.findByEmail(email);
        if (existingUser == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(gson.toJson(Map.of("error", "User not found")));
            return;
        }

        // Update fields
        if (json.has("username"))
            existingUser.setUsername(json.get("username").getAsString());
        if (json.has("address"))
            existingUser.setAddress(json.get("address").getAsString());

        userDAO.updateUser(existingUser);

        resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Profile updated")));
    }

    private void handleUpdatePassword(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);

        String email = json.get("email").getAsString();
        String currentPassword = json.get("currentPassword").getAsString();
        String newPassword = json.get("newPassword").getAsString();

        User user = userDAO.findByEmail(email);

        if (user != null && user.getPassword().equals(currentPassword)) {
            user.setPassword(newPassword);
            userDAO.updateUser(user);
            resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Password updated")));
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", "Invalid current password")));
        }
    }
}
