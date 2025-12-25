package com.example.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.example.model.Product;
import com.example.util.MongoDBUtil;


import java.util.ArrayList;
import java.util.List;

public class ProductDAO {
    private final MongoCollection<Product> productCollection;

    public ProductDAO() {
        MongoDatabase db = MongoDBUtil.getDatabase(); // Gets the database instance
        this.productCollection = db.getCollection("products", Product.class);

    }

    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        productCollection.find().into(products); // Find all relevant documents and insert it in the List of POJOS
        return products;
    }

    public void saveProduct(Product product) {
        productCollection.insertOne(product);
    }

}
