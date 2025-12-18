package com.example;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;

public class UserDAO {
    private final MongoCollection<Document> usersCollection;

    public UserDAO() {
        // Connect to the users collection in MongoDB
        MongoDatabase database = MongoDBUtil.getDatabase();
        this.usersCollection = database.getCollection("users");

        // Seed default users on first run (when collection is empty)
        if (usersCollection.countDocuments() == 0) {
            seedUsersFromJson();
        }
    }

    // 1. Create a new user (Sign Up)
    public void createUser(User user) {
        Document doc = new Document("user_fname", user.getUser_fname())
                .append("user_lname", user.getUser_lname())
                .append("username", user.getUsername())
                .append("password", user.getPassword())
                .append("email", user.getEmail())
                .append("address", user.getAddress())
                .append("role", user.getRole())
                .append("companyName", user.getCompanyName());

        usersCollection.insertOne(doc);
    }

    // 2. Find a user by Email (Login)
    public User findByEmail(String email) {
        Document doc = usersCollection.find(Filters.eq("email", email)).first();
        return userFromDocument(doc);
    }

    public User findByUsername(String username) {
        Document doc = usersCollection.find(Filters.eq("username", username)).first();
        return userFromDocument(doc);
    }

    // Helper function to change a mongoDB document to a Java Object
    private User userFromDocument(Document doc) {
        if (doc == null) return null;

        User user = new User(
                doc.getString("user_fname"),
                doc.getString("user_lname"),
                doc.getString("username"),
                doc.getString("password"),
                doc.getString("email"),
                doc.getString("address"),
                doc.getString("role"),
                doc.getString("companyName")
        );
        user.setId(doc.getObjectId("_id"));
        return user;
    }

    // --- Seeding helpers ---

    private void seedUsersFromJson() {
        try {
            // users_seed.json should live in src/main/resources
            InputStream is = getClass().getClassLoader().getResourceAsStream("users_seed.json");
            if (is == null) {
                System.err.println("users_seed.json not found on classpath, skipping user seeding.");
                return;
            }

            InputStreamReader reader = new InputStreamReader(is);
            Gson gson = new Gson();
            Type listType = new TypeToken<List<User>>() {}.getType();
            List<User> seedUsers = gson.fromJson(reader, listType);

            if (seedUsers != null && !seedUsers.isEmpty()) {
                for (User user : seedUsers) {
                    createUser(user);
                }
                System.out.println("Seeded " + seedUsers.size() + " users into MongoDB.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to seed users from JSON: " + e.getMessage());
        }
    }
}