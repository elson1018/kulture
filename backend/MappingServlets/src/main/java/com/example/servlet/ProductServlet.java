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

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.Base64;

@WebServlet("/api/products/*") // backend URL
public class ProductServlet extends HttpServlet { // Product Servlet

    private ProductDAO productDAO;
    private Gson gson;

    // Setup necessary CORS Headers
    private void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");// Allows all to access this server
        resp.setHeader("Access-Control-Allow-Methods", "GET , POST , OPTIONS , DELETE"); // Specifiying which method is
                                                                                         // allowed to access the
                                                                                         // resource
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");// Specify allowed headers for each request
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    @Override
    public void init() throws ServletException { // Initiate necessary objects during first run
        super.init();
        this.productDAO = new ProductDAO();
        this.gson = new Gson();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp); // Setting the cors headers
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        setupCORS(resp);
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
        setupCORS(resp); // Check if the necessary headers are correct
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false); // Don't create a new session if one doesn't exist

        /*
         * if (session == null || session.getAttribute("role") == null) {
         * resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Error
         * resp.getWriter().write(gson.toJson(Map.of("error",
         * "You must be logged in")));
         * return;
         * }
         */

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

            // Save image to file system and get path
            String imagePath = saveImageToFileSystem(base64Image, newProduct.getCategory(), imageFileName);

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
        // Resolve path relative to backend project root
        String userDir = System.getProperty("user.dir");
        File categoryDir;

        // Navigate from backend/MappingServlets to frontend/public/products/{category}
        // Structure: kulture/backend/MappingServlets ->
        // kulture/frontend/public/products/{category}
        Path categoryPath = Paths.get(userDir).getParent().getParent()
                .resolve("frontend")
                .resolve("public")
                .resolve("products")
                .resolve(category);

        categoryDir = categoryPath.normalize().toFile();

        System.out.println("SAVING IMAGE TO: " + categoryPath.toAbsolutePath());

        // If that path doesn't exist, try alternative (in case structure is different)
        if (!categoryDir.getParentFile().exists()) {
            // Try going up one more level
            categoryPath = Paths.get(userDir).getParent().getParent().getParent()
                    .resolve("frontend")
                    .resolve("public")
                    .resolve("products")
                    .resolve(category);
            categoryDir = categoryPath.normalize().toFile();
        }

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
}
