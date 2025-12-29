package com.example.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
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

    public boolean deleteProduct(String productId) {
        // @BsonId maps 'id' field to MongoDB's '_id'
        return productCollection.deleteOne(Filters.eq("_id", productId)).getDeletedCount() > 0;
    }

    public void addReviewToProduct(String productId, com.example.model.Review review) {
        // add user review into product review object
        productCollection.updateOne(
                Filters.eq("_id", productId),
                com.mongodb.client.model.Updates.push("reviews", review));
    }
}