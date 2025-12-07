package com.example;


import com.google.gson.Gson;// JSON serialization
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@WebServlet("/api/products")//backend URL
public class ProductServlet extends HttpServlet{ //Product Servlet

    private void setupCORS(HttpServletResponse resp){
        resp.setHeader("Access-Control-Allow-Origin", "*");// Allows all to access this server 
        resp.setHeader("Access-Allow-Control-Allow-Method" , "GET , POST , OPTIONS , DELETE"); //Specifiying which method is allowed to access the resource
        resp.setHeader("Access-Control-Allow-Headers" , "Content-Type");//Specify allowed headers for each request
    }
    @Override
    public void init() throws ServletException{
        super.init();
        ProductDAO dao = new ProductDAO();
    }


    @Override
    protected void doOptions( HttpServletRequest req,HttpServletResponse resp){//Overriding the default doOptions method
        setupCORS(resp); //Setting the cors headers
        resp.setStatus(HttpServletResponse.SC_OK); // Why do i have to set the response to okay after setting the headers
    }

    @Override
    protected void doGet(HttpServletRequest req , HttpServletResponse resp){
        setupCORS(resp);
        resp.setContentType("application/json");//Setting the Content Type to JSON for the client
        resp.setStatus(HttpServletResponse.SC_OK);//Send back a successful response
        try{
            ProductDAO dao = new ProductDAO(); //Instantiate dao object to interact with database
            List<Product> products = dao.getAllProducts();//Gets all the products and store in products
            String json = new Gson().toJson(products);//Serialise the products into json format
            resp.getWriter().write(json);//Write the serialised json in the response stream
        }catch(Exception e){
            System.err.println("An unexpected error occurred during product retrieval:");
            e.printStackTrace(System.err);//what Does this mean bruh
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try{
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
        resp.setCharacterEncoding("UTF-8");//Why do i need to set the encoding
        try{
            ProductDAO dao = new ProductDAO();//Declare a dao instance

            String name = req.getParameter("name"); //Read the stuff from the request
            String category = req.getParameter("category");
            String priceStr = req.getParameter("price");
            String description = req.getParameter("description");
            String imageParam = req.getParameter("image");//How does image works here
            String ratingStr =  req.getParameter("rating");
            List<String> images = new ArrayList<>();

            if(name == null         || name.isEmpty()        ||   
               priceStr == null     || priceStr.isEmpty()    || 
               ratingStr == null    || ratingStr.isEmpty()   || 
               category == null     || category.isEmpty()    || 
               description == null  || description.isEmpty() || 
               imageParam == null        || imageParam.isEmpty()){
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\\\"status\\\":\\\"error\\\", \\\"message\\\":\\\"Missing required fields.\\\"}");//Why this specific string 
                return;
            }
                //Parsing
             if (imageParam != null && !imageParam.isEmpty()) {
                if (imageParam.startsWith("data:image")) {
                    images.add(imageParam);
                } else {
                    images = Arrays.asList(imageParam.split(","));
                }
            }
            double price = Double.parseDouble(priceStr);
            double rating = Double.parseDouble(ratingStr);
            
          
          
           

   

             Product newProduct = new Product( name , category , price , description , images , rating);
       
            dao.saveProduct(newProduct);



            resp.setStatus(HttpServletResponse.SC_CREATED);// Signal creation operations
            
            String newId = newProduct.getId().toString(); // Gets the id that is automatically created by mongoDB
            resp.getWriter().write("{\"status\":\"success\", \"id\":\"" + newId + "\"}");
            
       
        }catch(Exception e){
           e.printStackTrace();
           resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
           resp.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");

        }


        resp.setStatus(HttpServletResponse.SC_OK); 
    }
}
