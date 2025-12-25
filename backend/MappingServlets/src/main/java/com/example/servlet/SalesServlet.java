package com.example.servlet;

import com.google.gson.Gson;
import com.example.dao.SalesDAO;
import com.example.model.Sale;
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

    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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

    public List<Sale> getSalesByUserEmail(String email) {
        return salesDAO.getSalesByCustomerEmail(email);
    }
}
