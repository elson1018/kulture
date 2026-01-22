package com.example.dao;

import com.example.model.User;
import com.example.util.MongoDBUtil;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import org.bson.Document;

public class UserDAO {
    private final MongoCollection<Document> usersCollection;

    public UserDAO() {
        // Connect to the users collection in MongoDB
        MongoDatabase database = MongoDBUtil.getDatabase();
        this.usersCollection = database.getCollection("users");

    }

    // Create a new user
    public void createUser(User user) {
        Document doc = new Document("user_fname", user.getUser_fname())
                .append("user_lname", user.getUser_lname())
                .append("password", user.getPassword())
                .append("email", user.getEmail())
                .append("address", user.getAddress())
                .append("role", user.getRole());

        usersCollection.insertOne(doc);
    }

    // Find a user by Email
    public User findByEmail(String email) {
        Document doc = usersCollection.find(Filters.eq("email", email)).first();
        return userFromDocument(doc);
    }

    public User findById(String id) {
        try {
            Document doc = usersCollection.find(Filters.eq("_id", new org.bson.types.ObjectId(id))).first();
            return userFromDocument(doc);
        } catch (Exception e) {
            return null;
        }
    }

    // Function to change mongoDB document to a Java Object
    private User userFromDocument(Document doc) {
        if (doc == null)
            return null;

        User user = new User(
                doc.getString("user_fname"),
                doc.getString("user_lname"),
                doc.getString("password"),
                doc.getString("email"),
                doc.getString("address"),
                doc.getString("role"));
        user.setId(doc.getObjectId("_id"));
        return user;
    }

    // Update user details
    public void updateUser(User user) {
        Document update = new Document()
                .append("email", user.getEmail())
                .append("address", user.getAddress());

        // Only update password if it's set
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            update.append("password", user.getPassword());
        }

        if (user.getId() != null) {
            usersCollection.updateOne(Filters.eq("_id", user.getId()), new Document("$set", update));
        } else {
            usersCollection.updateOne(Filters.eq("email", user.getEmail()), new Document("$set", update));
        }
    }

    // Update user address by ID
    public void updateUserAddress(String userId, String address) {
        try {
            usersCollection.updateOne(
                    Filters.eq("_id", new org.bson.types.ObjectId(userId)),
                    new Document("$set", new Document("address", address)));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}