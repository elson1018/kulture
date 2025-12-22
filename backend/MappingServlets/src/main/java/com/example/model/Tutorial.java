package com.example;

import org.bson.types.ObjectId;
import java.util.List;

public class Tutorial {
    private ObjectId id;
    private String name;
    private String instructor;
    private double price;
    private String description;
    private boolean isLiveClass;
    private List<String> images;

    public Tutorial() {}

    public Tutorial(String name, String instructor, double price, String description, boolean isLiveClass, List<String> images) {
        this.name = name;
        this.instructor = instructor;
        this.price = price;
        this.description = description;
        this.isLiveClass = isLiveClass;
        this.images = images;
    }

    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean getIsLiveClass() { return isLiveClass; }
    public void setIsLiveClass(boolean isLiveClass) { this.isLiveClass = isLiveClass; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}