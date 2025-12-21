package com.example;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mongodb.client.MongoDatabase;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;

public class DatabaseSeeder {
    public static void seedAll() {
        MongoDatabase db = MongoDBUtil.getDatabase();

   
        //Drop Collections
        db.getCollection("users").drop();
        db.getCollection("products").drop();
        db.getCollection("carts").drop();
        System.out.println("Database dropped");
        //Seed Users
        seedUsers(db);

        //Seed Products
        seedProducts(db);
    }

    private static void seedUsers(MongoDatabase db) {
        try (InputStream is = DatabaseSeeder.class.getClassLoader().getResourceAsStream("users_seed.json")) {
            if (is == null) return;
            InputStreamReader reader = new InputStreamReader(is);
            Type listType = new TypeToken<List<User>>() {}.getType();
            List<User> users = new Gson().fromJson(reader, listType);
            if (users != null) {
                UserDAO dao = new UserDAO();
                users.forEach(dao::createUser);
                System.out.println("Seeded " + users.size() + " users.");
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    private static void seedProducts(MongoDatabase db) {
        try (InputStream is = DatabaseSeeder.class.getClassLoader().getResourceAsStream("products_seed.json")) {
            if (is == null) return;
            InputStreamReader reader = new InputStreamReader(is);
            Type listType = new TypeToken<List<Product>>() {}.getType();
            List<Product> products = new Gson().fromJson(reader, listType);
            if (products != null) {
                db.getCollection("products", Product.class).insertMany(products);
                System.out.println("Seeded " + products.size() + " products.");
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
}