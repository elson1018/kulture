package com.example.servlet;

import com.google.gson.Gson;
import com.example.dao.TutorialDAO;
import com.example.model.Tutorial;
import com.example.util.CorsConfig;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/api/tutorials")
public class TutorialServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private TutorialDAO tutorialDAO;

    @Override
    public void init() {
        this.tutorialDAO = new TutorialDAO();
    }

    private void setupCORS(HttpServletResponse resp, HttpServletRequest req) {
        CorsConfig.setupCORS(resp, req);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp, req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp, req);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            List<Tutorial> tutorials = tutorialDAO.getAllTutorials();
            resp.getWriter().write(gson.toJson(tutorials));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp, req);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {

            // Read JSON request
            StringBuilder jsonBuilder = new StringBuilder();
            try (java.io.BufferedReader reader = req.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
            }

            String jsonString = jsonBuilder.toString();
            Map<String, Object> jsonMap = gson.fromJson(jsonString, Map.class);

            String modifiedJson = gson.toJson(jsonMap);
            Tutorial newTutorial = gson.fromJson(modifiedJson, Tutorial.class);

            tutorialDAO.saveTutorial(newTutorial);

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(
                    gson.toJson(Map.of("status", "success", "message", "Tutorial added successfully")));
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp, req);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("role") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(Map.of("error", "You must be logged in")));
            return;
        }

        String role = (String) session.getAttribute("role");
        if (!"ADMIN".equalsIgnoreCase(role)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write(gson.toJson(Map.of("error", "Access Denied: Admin only")));
            return;
        }

        try {
            String tutorialId = req.getParameter("id");
            if (tutorialId == null || tutorialId.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Tutorial ID is required")));
                return;
            }

            boolean deleted = tutorialDAO.deleteTutorial(tutorialId);
            if (deleted) {
                resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Tutorial deleted")));
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write(gson.toJson(Map.of("error", "Tutorial not found")));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(Map.of("error", e.getMessage())));
        }
    }
}