package com.example.servlet;

import com.google.gson.Gson;
import com.example.dao.SalesDAO;
import com.example.model.Sale;
import com.example.util.CorsConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/sales")
public class SalesServlet extends HttpServlet {
    private SalesDAO salesDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        this.salesDAO = new SalesDAO();
        this.gson = new Gson();
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
            String email = req.getParameter("email");

            if (email != null && !email.isEmpty()) {
                // this return orders for specific customer
                List<Sale> customerSales = salesDAO.getSalesByCustomerEmail(email);
                resp.getWriter().write(gson.toJson(Map.of("sales", customerSales)));
            } else {
                // this return all sales for admin dashboard
                double totalRevenue = salesDAO.getTotalRevenue();
                List<Sale> allSales = salesDAO.getAllSales();

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("totalRevenue", totalRevenue);
                responseData.put("sales", allSales);

                resp.getWriter().write(gson.toJson(responseData));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(Map.of("error", e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp, req);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Check if user is admin
        javax.servlet.http.HttpSession session = req.getSession(false);
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
            // Parse request body
            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = req.getReader().readLine()) != null) {
                jsonBuilder.append(line);
            }

            com.google.gson.JsonObject requestJson = gson.fromJson(jsonBuilder.toString(),
                    com.google.gson.JsonObject.class);

            String saleId = requestJson.has("id") ? requestJson.get("id").getAsString() : null;
            String newStatus = requestJson.has("status") ? requestJson.get("status").getAsString() : null;

            if (saleId == null || saleId.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Sale ID is required")));
                return;
            }

            if (newStatus == null || newStatus.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Status is required")));
                return;
            }

            // Validate status value
            if (!newStatus.equals("Pending") && !newStatus.equals("Processing")
                    && !newStatus.equals("Shipped") && !newStatus.equals("Completed")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Invalid status value")));
                return;
            }

            boolean updated = salesDAO.updateSaleStatus(saleId, newStatus);
            if (updated) {
                resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Order status updated")));
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write(gson.toJson(Map.of("error", "Order not found")));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(Map.of("error", e.getMessage())));
        }
    }

    public List<Sale> getSalesByUserEmail(String email) {
        return salesDAO.getSalesByCustomerEmail(email);
    }
}
