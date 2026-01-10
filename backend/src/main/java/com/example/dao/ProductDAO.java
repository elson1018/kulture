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

    public Product getProductById(String productId) {
        return productCollection.find(Filters.eq("_id", productId)).first();
    }

    public void saveProduct(Product product) {
        productCollection.insertOne(product);
    }

    public boolean deleteProduct(String productId) {
        // @BsonId maps 'id' field to MongoDB's '_id'
        return productCollection.deleteOne(Filters.eq("_id", productId)).getDeletedCount() > 0;
    }

    public void addReviewToProduct(String productId, com.example.model.Review review) {
        // Fetch product to get current reviews and recalculate rating
        Product product = productCollection.find(Filters.eq("_id", productId)).first();
        if (product != null) {
            List<com.example.model.Review> reviews = product.getReviews();
            if (reviews == null) {
                reviews = new ArrayList<>();
            }
            reviews.add(review);

            // Recalculate rating
            double totalRating = 0;
            for (com.example.model.Review r : reviews) {
                totalRating += r.getRating();
            }
            double newRating = reviews.isEmpty() ? 0 : totalRating / reviews.size();
            // Round to 1 decimal place
            newRating = Math.round(newRating * 10.0) / 10.0;

            // Update product with new reviews list and new rating
            productCollection.updateOne(
                    Filters.eq("_id", productId),
                    com.mongodb.client.model.Updates.combine(
                            com.mongodb.client.model.Updates.set("reviews", reviews),
                            com.mongodb.client.model.Updates.set("rating", newRating)));
        }
    }
}