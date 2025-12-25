package com.example.util;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mongodb.client.MongoDatabase;
import com.example.dao.UserDAO;

import com.example.model.Product;
import com.example.model.Tutorial;
import com.example.model.User;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;

public class DatabaseSeeder {
    public static void seedAll() {
        MongoDatabase db = MongoDBUtil.getDatabase();

        // Drop Collections Safely
        List<String> collectionsToDrop = List.of("users", "products", "carts", "sales", "tutorials");
        for (String collectionName : db.listCollectionNames()) {
            if (collectionsToDrop.contains(collectionName)) {
                db.getCollection(collectionName).drop();
                System.out.println("Dropped collection: " + collectionName);
            }
        }
        
        
        //Seed Users
        seedUsers(db);

        // Seed Products
        seedProducts(db);

        // Seed Tutorials
        seedTutorials(db);
    }

    private static void seedUsers(MongoDatabase db) {
        try (InputStream is = DatabaseSeeder.class.getClassLoader().getResourceAsStream("users_seed.json")) {
            if (is == null)
                return;
            InputStreamReader reader = new InputStreamReader(is);
            Type listType = new TypeToken<List<User>>() {
            }.getType();
            List<User> users = new Gson().fromJson(reader, listType);
            if (users != null) {
                UserDAO dao = new UserDAO();
                users.forEach(dao::createUser);
                System.out.println("Seeded " + users.size() + " users.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void seedProducts(MongoDatabase db) {
        try (InputStream is = DatabaseSeeder.class.getClassLoader().getResourceAsStream("products_seed.json")) {
            if (is == null)
                return;
            InputStreamReader reader = new InputStreamReader(is);
            Type listType = new TypeToken<List<Product>>() {
            }.getType();
            List<Product> products = new Gson().fromJson(reader, listType);
            if (products != null) {
                db.getCollection("products", Product.class).insertMany(products);
                System.out.println("Seeded " + products.size() + " products.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void seedTutorials(MongoDatabase db) {
        try (InputStream is = DatabaseSeeder.class.getClassLoader().getResourceAsStream("tutorials_seed.json")) {
            if (is == null)
                return;
            InputStreamReader reader = new InputStreamReader(is);
            Type listType = new TypeToken<List<Tutorial>>() {
            }.getType();
            List<Tutorial> tutorials = new Gson().fromJson(reader, listType);
            if (tutorials != null) {
                db.getCollection("tutorials", Tutorial.class).insertMany(tutorials);
                System.out.println("Seeded " + tutorials.size() + " tutorials.");
            }else{
                System.out.println("Unable to seed tutorials");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}