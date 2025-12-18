package com.example;


import com.google.gson.Gson;// JSON serialization
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@WebServlet("/api/products/*")//backend URL
public class ProductServlet extends HttpServlet{ //Product Servlet

    private ProductDAO productDAO;
    private Gson gson;

    //Setup necessary CORS Headers
    private void setupCORS(HttpServletResponse resp){
        resp.setHeader("Access-Control-Allow-Origin", "*");// Allows all to access this server 
        resp.setHeader("Access-Control-Allow-Methods" , "GET , POST , OPTIONS , DELETE"); //Specifiying which method is allowed to access the resource
        resp.setHeader("Access-Control-Allow-Headers" , "Content-Type");//Specify allowed headers for each request
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    @Override
    public void init() throws ServletException{ //Initiate necessary objects during first run
        super.init();
        this.productDAO = new ProductDAO();
        this.gson = new Gson();
    }


    @Override
    protected void doOptions( HttpServletRequest req,HttpServletResponse resp){
        setupCORS(resp); //Setting the cors headers
        resp.setStatus(HttpServletResponse.SC_OK); 
    }

    @Override
    protected void doGet(HttpServletRequest req , HttpServletResponse resp){
        setupCORS(resp);
        resp.setContentType("application/json");//Setting the Content Type to JSON for the client
        resp.setStatus(HttpServletResponse.SC_OK);//Send back a successful response

        try{
            List<Product> products = productDAO.getAllProducts();//Gets all the products and store in products
            String json = new Gson().toJson(products);//Serialise the products into json format
            resp.getWriter().write(json);//Write the serialised json in the response stream
        }catch(Exception e){
         
            
            try{
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//Set error status for servlet response
                resp.getWriter().write("An unexpected error occurred during product retrieval.");
            }catch ( IOException exception){
                System.err.print("Fail to write error response : " + exception.getMessage()); //Catch response writing error
            }
           
        } 
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setupCORS(resp); //Check if the necessary headers are correct
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false); // Don't create a new session if one doesn't exist
        
        if (session == null || session.getAttribute("role") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Error
            resp.getWriter().write(gson.toJson(Map.of("error", "You must be logged in")));
            return;
        }

        String role = (String) session.getAttribute("role");
        
        // Allow if ADMIN or SUPPLIER
        if (!"ADMIN".equals(role) && !"SUPPLIER".equals(role)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Error
            resp.getWriter().write(gson.toJson(Map.of("error", "Access Denied: Admins/Suppliers only")));
            return;
        }

        try{
           Product newProduct = gson.fromJson(req.getReader(), Product.class);

            //Basic Validation
            if (   newProduct.getName() == null     || newProduct.getPrice() <= 0
                || newProduct.getCategory() == null || newProduct.getDescription() == null
                || newProduct.getImages() == null   || newProduct.getImages().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Invalid product data")));
                return;
            }

            // Save
            productDAO.saveProduct(newProduct);

            // Response
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "success");
            responseMap.put("id", newProduct.getId() != null ? newProduct.getId().toString() : "new");
            
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(responseMap));
            
       
        }catch(Exception e){
           e.printStackTrace();
           resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
           resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");

        }


        resp.setStatus(HttpServletResponse.SC_OK); 
    }
}
