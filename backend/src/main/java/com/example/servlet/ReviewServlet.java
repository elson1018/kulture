package com.example.servlet;

import com.example.dao.ProductDAO;
import com.example.dao.SalesDAO;
import com.example.model.Product;
import com.example.model.Review;
import com.example.model.Sale;
import com.example.util.JsonUtil;
import com.example.util.CorsConfig;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "ReviewServlet", urlPatterns = "/api/reviews")
public class ReviewServlet extends HttpServlet {

    private ProductDAO productDAO;
    private SalesDAO salesDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        // initialize DAOs and Gson for JSON handling
        this.productDAO = new ProductDAO();
        this.salesDAO = new SalesDAO();
        this.gson = new Gson();
    }

    // helper method to setup CORS headers for all responses
    private void setupCORS(HttpServletResponse resp, HttpServletRequest req) {
        CorsConfig.setupCORS(resp, req);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp, req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp, req);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            JsonObject body = JsonUtil.parseBody(req);

            // to determine if we are checking eligibility or submitting a review
            String action = body.has("action") ? body.get("action").getAsString() : "submit";
            String email = body.get("email").getAsString();
            String productId = body.get("productId").getAsString();

            if ("check".equals(action)) {
                // verify if user purchased the product
                boolean hasPurchased = checkPurchase(email, productId);
                Map<String, Boolean> result = Map.of("canReview", hasPurchased);
                resp.getWriter().write(gson.toJson(result));
                return;
            }

            // verify purchase before allowing submission
            if (!checkPurchase(email, productId)) {
                resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                resp.getWriter().write(gson.toJson(Map.of("message", "You must purchase this product to review it.")));
                return;
            }

            // extract review details
            int rating = body.get("rating").getAsInt();
            String comment = body.get("comment").getAsString();
            String userName = body.has("userName") ? body.get("userName").getAsString() : "Anonymous";

            // create and save the review object directly to the product
            Review review = new Review(email, userName, rating, comment);
            productDAO.addReviewToProduct(productId, review);

            resp.getWriter().write(gson.toJson(Map.of("success", true, "message", "Review submitted successfully")));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(Map.of("error", e.getMessage())));
        }
    }

    // core logic to check if a user has purchased a specific product
    private boolean checkPurchase(String email, String productId) {
        List<Product> products = productDAO.getAllProducts();
        Product targetProduct = products.stream()
                .filter(p -> p.getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (targetProduct == null) {
            return false;
        }

        List<Sale> userSales = salesDAO.getSalesByCustomerEmail(email);

        for (Sale sale : userSales) {
            if (sale.getProductIds() != null) {
                if (sale.getProductIds().contains(productId)) {
                    return true;
                }
            }
            if (sale.getProductNames() != null) {
                for (String boughtName : sale.getProductNames()) {
                    if (boughtName.trim().equalsIgnoreCase(targetProduct.getName().trim())) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
