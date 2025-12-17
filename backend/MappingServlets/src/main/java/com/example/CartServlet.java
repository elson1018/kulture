package com.example;

import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

    private CartDAO cartDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        super.init();
        this.cartDAO = new CartDAO();
        this.gson = new Gson();
    }

    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
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

 
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", "Please log in to view cart")));
            return;
        }

        String userId = (String) session.getAttribute("user_id");
        Cart cart = cartDAO.getCart(userId);
        
        resp.getWriter().write(gson.toJson(cart));
    }

   
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", "Please log in to shop")));
            return;
        }

        try {
            String userId = (String) session.getAttribute("user_id");
            
 
            CartItem newItem = gson.fromJson(req.getReader(), CartItem.class);
            
        
            if (newItem.getProductId() == null || newItem.getQuantity() <= 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", "Invalid product data")));
                return;
            }

      
            cartDAO.addToCart(userId, newItem);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Item added to cart")));

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setupCORS(resp);
        resp.setContentType("application/json");

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            String userId = (String) session.getAttribute("user_id");
            String productId = req.getParameter("productId"); 

            if (productId != null) {
                cartDAO.removeFromCart(userId, productId);
                resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Item removed")));
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", "Product ID required")));
            }

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", e.getMessage())));
        }
    }
}