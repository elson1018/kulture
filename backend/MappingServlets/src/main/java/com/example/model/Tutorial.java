package com.example.model;

import java.util.List;
import org.bson.codecs.pojo.annotations.BsonId;


public class Tutorial {
    
    @BsonId
    private String id;
    private String name;
    private String instructor;
    private double price;
    private String description;
    private boolean isLiveClass;
    private double rating;
    private List<String> images;
    private String videoUrl;

    public Tutorial() {}

    public Tutorial(String name, String instructor, double price, String description, boolean isLiveClass, double rating,
            List<String> images, String videoUrl) {
        this.name = name;
        this.instructor = instructor;
        this.price = price;
        this.description = description;
        this.isLiveClass = isLiveClass;
        this.rating = rating;
        this.images = images;
        this.videoUrl = videoUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isLiveClass() { return isLiveClass; }
    public void setLiveClass(boolean liveClass) { isLiveClass = liveClass; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
}