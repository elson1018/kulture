package com.example.servlet;

import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.example.dao.ProductDAO;
import com.example.dao.SalesDAO;
import com.example.model.Product;
import com.example.util.CorsConfig;

import com.example.service.CloudinaryService;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.Base64;

@WebServlet("/api/products/*") // backend URL
public class ProductServlet extends HttpServlet { // Product Servlet

    private ProductDAO productDAO;
    private Gson gson;
    private CloudinaryService cloudinaryService;

    // Setup necessary CORS Headers
    private void setupCORS(HttpServletResponse resp, HttpServletRequest req) {
        CorsConfig.setupCORS(resp, req);
    }

    @Override
    public void init() throws ServletException { // Initiate necessary objects during first run
        super.init();
        this.productDAO = new ProductDAO();
        this.gson = new Gson();
        this.cloudinaryService = new CloudinaryService();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp, req); // Setting the cors headers
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp, req);
        resp.setContentType("application/json");// Setting the Content Type to JSON for the client
        resp.setStatus(HttpServletResponse.SC_OK);// Send back a successful response

        try {

            String action = req.getParameter("action"); // Gets the action parameter from the client request
            if ("getStats".equals(action)) {
                SalesDAO salesDAO = new SalesDAO();
                double totalRevenue = salesDAO.getTotalRevenue();
                resp.getWriter().write(new Gson().toJson(java.util.Map.of("totalRevenue", totalRevenue)));
                return;
            }

            if ("trending".equals(action)) {
                List<Product> products = productDAO.getTrendingProducts(4);
                resp.getWriter().write(gson.toJson(products));
                return;
            }

            String category = req.getParameter("category");
            if (category != null && !category.isEmpty()) {
                List<Product> products = productDAO.getProductsByCategory(category);
                resp.getWriter().write(gson.toJson(products));
                return;
            }

            List<Product> products = productDAO.getAllProducts();// Gets all the products and store in products

            String json = new Gson().toJson(products);// Serialise the products into json format
            resp.getWriter().write(json);// Write the serialised json in the response stream

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp, req); // Check if the necessary headers are correct
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false); // Don't create a new session if one doesn't exist

        if (session == null || session.getAttribute("role") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Error
            resp.getWriter().write(gson.toJson(Map.of("error", "You must be logged in")));
            return;
        }

        String role = (String) session.getAttribute("role");

        // Allow only ADMIN
        if (!"ADMIN".equalsIgnoreCase(role)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Error
            resp.getWriter().write(gson.toJson(Map.of("error", "Access Denied: Admin only")));
            return;
        }

        try {
            // Read JSON request
            StringBuilder jsonBuilder = new StringBuilder();
            try (BufferedReader reader = req.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
            }

            String jsonString = jsonBuilder.toString();
            Map<String, Object> jsonMap = gson.fromJson(jsonString, Map.class);

            // Extract product data
            Product newProduct = new Product();

            String uniqueID = "P-" + System.currentTimeMillis();
            newProduct.setId(uniqueID);

            newProduct.setName((String) jsonMap.get("name"));
            newProduct.setCategory((String) jsonMap.get("category"));
            newProduct.setDescription((String) jsonMap.get("description"));

            // Handle price (could be Double or String)
            Object priceObj = jsonMap.get("price");
            if (priceObj instanceof Number) {
                newProduct.setPrice(((Number) priceObj).doubleValue());
            } else if (priceObj instanceof String) {
                newProduct.setPrice(Double.parseDouble((String) priceObj));
            }

            newProduct.setRating(0.0);
            newProduct.setCompany((String) jsonMap.getOrDefault("company", "Kulture"));

            // Basic Validation
            if (newProduct.getName() == null || newProduct.getPrice() <= 0
                    || newProduct.getCategory() == null || newProduct.getDescription() == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Invalid product data")));
                return;
            }

            // Handle image upload
            String imageFileName = (String) jsonMap.get("imageFileName");
            List<String> imageBase64List = (List<String>) jsonMap.get("images");

            if (imageBase64List == null || imageBase64List.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Image is required")));
                return;
            }

            String base64Image = imageBase64List.get(0);
            if (base64Image == null || base64Image.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Image is required")));
                return;
            }

            // Hybrid Image Storage Strategy
            String imagePath;
            if (cloudinaryService.isConfigured()) {
                // Cloud Mode: Upload to Cloudinary
                imagePath = cloudinaryService.uploadImage(base64Image);
            } else {
                // Local Mode: Save to local file system (Development)
                imagePath = saveImageToFileSystem(base64Image, newProduct.getCategory(), imageFileName);
            }

            // Set image path in product (as List<String>)
            List<String> imagePaths = new ArrayList<>();
            imagePaths.add(imagePath);
            newProduct.setImages(imagePaths);

            // Save product to MongoDB
            productDAO.saveProduct(newProduct);
            System.out.println("Product saved successfully");

            // Response
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "success");
            responseMap.put("id", newProduct.getId() != null ? newProduct.getId().toString() : "new");

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(responseMap));

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");

        }

    }

    /**
     * Saves base64 image to file system in category-specific folder
     * Returns the path to be stored in MongoDB (e.g.,
     * "/products/Instruments/image.jpg")
     */
    private String saveImageToFileSystem(String base64Image, String category, String originalFileName)
            throws IOException {
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        String base64Data = base64Image;
        if (base64Image.contains(",")) {
            base64Data = base64Image.substring(base64Image.indexOf(",") + 1);
        }

        // Decode base64
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        // Determine file extension from original filename or default to jpg
        String extension = "jpg";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
        }

        // Generate unique filename
        String fileName = originalFileName != null
                ? originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_")
                : "product_" + System.currentTimeMillis() + "." + extension;

        // Ensure filename has extension
        if (!fileName.contains(".")) {
            fileName = fileName + "." + extension;
        }

        // Get the path to frontend public folder
        String userDir = System.getProperty("user.dir");

        Path startPath = Paths.get(userDir);
        Path frontendPath = null;

        // 1. Try resolving "frontend" in current dir (e.g. running from project root)
        if (startPath.resolve("frontend").toFile().exists()) {
            frontendPath = startPath.resolve("frontend");
        }
        // 2. Try resolving "frontend" in parent dir (e.g. running from "backend" dir)
        else if (startPath.getParent() != null && startPath.getParent().resolve("frontend").toFile().exists()) {
            frontendPath = startPath.getParent().resolve("frontend");
        }
        // 3. Try resolving "frontend" in 2 levels up (legacy deep nesting)
        else if (startPath.getParent() != null && startPath.getParent().getParent() != null
                && startPath.getParent().getParent().resolve("frontend").toFile().exists()) {
            frontendPath = startPath.getParent().getParent().resolve("frontend");
        }

        // Default to assuming sibling to backend if not found (or just root/frontend)
        if (frontendPath == null) {
            // Best guess fallback: assume we are in backend or root.
            // If we are in backend (common case), parent sibling is frontend.
            if (startPath.endsWith("backend")) {
                frontendPath = startPath.getParent().resolve("frontend");
            } else {
                frontendPath = startPath.resolve("frontend");
            }
        }

        Path categoryPath = frontendPath.resolve("public")
                .resolve("products")
                .resolve(category);

        File categoryDir = categoryPath.normalize().toFile();

        // Create directory if it doesn't exist
        if (!categoryDir.exists()) {
            categoryDir.mkdirs();
        }

        // Save file
        File imageFile = new File(categoryDir, fileName);
        try (FileOutputStream fos = new FileOutputStream(imageFile)) {
            fos.write(imageBytes);
        }

        // Return path in format that matches existing products:
        // "/products/{category}/{filename}"
        return "/products/" + category + "/" + fileName;
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
            String productId = req.getParameter("id");
            if (productId == null || productId.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Product ID is required")));
                return;
            }

            boolean deleted = productDAO.deleteProduct(productId);
            if (deleted) {
                resp.getWriter().write(gson.toJson(Map.of("status", "success", "message", "Product deleted")));
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write(gson.toJson(Map.of("error", "Product not found")));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(Map.of("error", e.getMessage())));
        }
    }
}
