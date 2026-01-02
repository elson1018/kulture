package com.example.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.example.model.Tutorial;
import com.example.util.MongoDBUtil;

import java.util.ArrayList;
import java.util.List;

public class TutorialDAO {
    private final MongoCollection<Tutorial> tutorialCollection;

    public TutorialDAO() {
        MongoDatabase db = MongoDBUtil.getDatabase();
        this.tutorialCollection = db.getCollection("tutorials", Tutorial.class);
    }

    public List<Tutorial> getAllTutorials() {
        List<Tutorial> tutorials = new ArrayList<>();
        tutorialCollection.find().into(tutorials);
        return tutorials;
    }

    public void saveTutorial(Tutorial tutorial) {
        tutorial.setId(generateNextId());
        tutorialCollection.insertOne(tutorial);
    }

    public boolean deleteTutorial(String tutorialId) {
        // @BsonId maps 'id' field to MongoDB's '_id', so we query by '_id'
        return tutorialCollection.deleteOne(Filters.eq("_id", tutorialId)).getDeletedCount() > 0;
    }

    private String generateNextId() {
        Tutorial lastTutorial = tutorialCollection.find()
                .sort(com.mongodb.client.model.Sorts.descending("_id"))
                .limit(1)
                .first();

        if (lastTutorial == null || lastTutorial.getId() == null) {
            return "T-0001";
        }

        String lastId = lastTutorial.getId();
        
        try {
            int idNum = Integer.parseInt(lastId.substring(2));
            return String.format("T-%04d", idNum + 1);
        } catch (NumberFormatException e) {
            // Fallback if existing/malformed IDs exist
            return "T-" + System.currentTimeMillis();
        }
    }
}
