package com.example;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;


import java.util.ArrayList;
import java.util.List;
import static com.mongodb.client.model.Filters.eq;
import org.bson.types.ObjectId;

public class ProductDAO {
  private final MongoCollection<Product> productCollection; 

  public ProductDAO(){
    MongoDatabase db = MongoDBUtil.getDatabase();//Gets the database instance
    this.productCollection = db.getCollection("products" , Product.class);//Why do we need to pass teh product.class inside?

  }

  public List<Product> getAllProducts(){
      List<Product> products = new ArrayList<>();
      productCollection.find().into(products);//Find all relevent documents and insert it in the List of POJOS
      return products;

  }

 public void saveProduct(Product product){
    productCollection.insertOne(product);
 }

 public void deleteProduct(String id){
  productCollection.deleteOne(eq("id" , new ObjectId(id)));
 }

 
}
