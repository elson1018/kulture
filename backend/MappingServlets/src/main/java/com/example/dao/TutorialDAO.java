package com.example.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
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
        tutorialCollection.insertOne(tutorial);
    }
}
