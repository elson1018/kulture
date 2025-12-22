package com.example;

import java.util.List;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
public class Product {
    @BsonId
    private String id;
    private String name;
    private String category;
    private double price;
    private String description;
    private List<String> images;
    private double rating;
    private String company;

    public Product() {}

    public Product(String  name, String category, double price, String description, List<String> images , double rating) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
        this.images = images;
        this.rating = rating;
        this.company = " ";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
}