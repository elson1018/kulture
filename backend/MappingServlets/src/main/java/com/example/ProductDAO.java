package com.example;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {
    private final MongoCollection<Product> productCollection;

    public ProductDAO() {
        MongoDatabase db = MongoDBUtil.getDatabase(); //Gets the database instance
        this.productCollection = db.getCollection("products", Product.class); //Why do we need to pass teh product.class inside?

        // Seed default products on first run (when collection is empty)
        if (productCollection.countDocuments() == 0) {
            seedProductsFromJson();
        }
    }

    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        productCollection.find().into(products); //Find all relevant documents and insert it in the List of POJOS
        return products;
    }

    public void saveProduct(Product product) {
        productCollection.insertOne(product);
    }

    // Note: your @BsonId on Product.id is a String, so deleting by ObjectId may not be correct.
    // Adjust this if you store ids as ObjectId in Mongo.
    /*
    public void deleteProduct(String id){
        productCollection.deleteOne(eq("_id" , new ObjectId(id)));
    }
    */

    // --- Seeding helpers ---

    private void seedProductsFromJson() {
        try {
            // products_seed.json should live in src/main/resources
            InputStream is = getClass().getClassLoader().getResourceAsStream("products_seed.json");
            if (is == null) {
                System.err.println("products_seed.json not found on classpath, skipping product seeding.");
                return;
            }

            InputStreamReader reader = new InputStreamReader(is);
            Gson gson = new Gson();
            Type listType = new TypeToken<List<Product>>() {}.getType();
            List<Product> seedProducts = gson.fromJson(reader, listType);

            if (seedProducts != null && !seedProducts.isEmpty()) {
                productCollection.insertMany(seedProducts);
                System.out.println("Seeded " + seedProducts.size() + " products into MongoDB.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to seed products from JSON: " + e.getMessage());
        }
    }
}
