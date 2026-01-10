
package com.example.servlet;

import com.google.gson.Gson;
import com.example.dao.CartDAO;
import com.example.dao.ProductDAO;
import com.example.dao.SalesDAO;
import com.example.dao.UserDAO;
import com.example.dao.BookingDAO;
import com.example.model.Booking;
import com.example.model.Cart;
import com.example.model.CartItem;
import com.example.model.Product;
import com.example.model.Sale;
import com.example.model.User;
import com.example.util.CorsConfig;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

    private CartDAO cartDAO;
    private ProductDAO productDAO;
    private UserDAO userDAO;
    private SalesDAO salesDAO;
    private BookingDAO bookingDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        super.init();
        this.cartDAO = new CartDAO();
        this.productDAO = new ProductDAO();
        this.userDAO = new UserDAO();
        this.salesDAO = new SalesDAO();
        this.bookingDAO = new BookingDAO();
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
        setupCORS(resp, req);
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
            String action = req.getParameter("action"); // Get the action parameter from the request

            // --- CHECKOUT ACTION ---
            if ("checkout".equals(action)) {
                List<CartItem> items = cartDAO.getCartItems(userId); // stores all the items in the cart of the current
                                                                     // user in session

                if (items == null || items.isEmpty()) { // Validation for the cart
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.getWriter().write(gson.toJson(Map.of("error", "Cart is empty")));
                    return;
                }

                // Calculate total revenue and collect names for the sale record, grouped by
                // company
                Map<String, List<CartItem>> itemsByCompany = items.stream()
                        .collect(Collectors
                                .groupingBy(item -> item.getCompany() != null ? item.getCompany() : "Kulture"));

                for (Map.Entry<String, List<CartItem>> entry : itemsByCompany.entrySet()) {
                    String company = entry.getKey();
                    List<CartItem> companyItems = entry.getValue();

                    double totalAmount = 0;
                    List<String> productNames = new ArrayList<>();

                    String email = (String) session.getAttribute("email");
                    if (email == null) {
                        // Fallback: try to get email from database if session attribute is missing
                        User user = userDAO.findById(userId);
                        if (user != null) {
                            email = user.getEmail();
                            session.setAttribute("email", email); // Restore it to session
                        }
                    }

                    if (email == null) {
                        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        resp.getWriter().write(gson.toJson(Map.of("status", "error", "message", "fail to get email")));
                        return;
                    }

                    for (CartItem item : companyItems) {
                        Product product = productDAO.getProductById(item.getProductId());
                        double itemPrice = item.getPrice();

                        // Check for discount (Instruments category gets 10% off)
                        if (product != null && "Instruments".equals(product.getCategory())) {
                            itemPrice = itemPrice * 0.90;
                        }

                        totalAmount += itemPrice * item.getQuantity();
                        productNames.add(item.getProductName());

                        // Create Booking for tutorials
                        if ("tutorial".equals(item.getItemType()) || "live_class".equals(item.getItemType())) {
                            String status = "Confirmed";
                            Booking booking = new Booking(
                                    email,
                                    item.getProductId(),
                                    new Date(),
                                    status,
                                    item.getProductName(),
                                    item.getPrice(),
                                    item.getSelectedDate());
                            bookingDAO.createBooking(booking);
                        }
                    }

                    // Apply shipping fee (RM 8.00)
                    totalAmount += 8.00;

                    Sale newSale = new Sale();
                    newSale.setCustomerEmail(email);
                    newSale.setProductNames(productNames);
                    // collect product id
                    List<String> productIds = companyItems.stream()
                            .map(CartItem::getProductId)
                            .collect(Collectors.toList());
                    newSale.setProductIds(productIds);

                    newSale.setTotalAmount(totalAmount);
                    newSale.setCompany(company);

                    salesDAO.recordSale(newSale); // Record the sale after user has checkedout
                }

                // Clear the cart after successful sale recording
                cartDAO.clearCart(userId);

                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Checkout successful!")));
                return;
            }

            CartItem newItem = gson.fromJson(req.getReader(), CartItem.class);
            if (newItem.getProductId() == null || newItem.getQuantity() == 0) {
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
        setupCORS(resp, req);
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