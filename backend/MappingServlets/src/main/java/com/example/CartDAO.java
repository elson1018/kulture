
package com.example;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import java.util.ArrayList;
import java.util.List;

public class CartDAO {
    private MongoCollection<Document> cartCollection;

    public CartDAO() {
        MongoDatabase database = MongoDBUtil.getDatabase();
        this.cartCollection = database.getCollection("carts");
    }

    //Get Cart function
    public Cart getCart(String userId) {
        Document doc = cartCollection.find(Filters.eq("userId", userId)).first();
        if (doc == null) {
            return new Cart(userId); 
        }
        return cartFromDocument(doc);
    }

    //Add to cart function
    public void addToCart(String userId, CartItem newItem) {
        Cart cart = getCart(userId);
        boolean itemExists = false;

        // Check if product is already in cart
        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(newItem.getProductId())) {
                // Just update quantity
                item.setQuantity(item.getQuantity() + newItem.getQuantity());
                itemExists = true;
                break;
            }
        }

        // If new item, add to list
        if (!itemExists) {
            cart.getItems().add(newItem);
        }

        saveCart(cart);
    }

    // 3. Remove Item
    public void removeFromCart(String userId, String productId) {
        Cart cart = getCart(userId);
        // Remove item if ID matches
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        saveCart(cart);
    }

    // 4. Clear Cart (After Checkout)
    public void clearCart(String userId) {
        cartCollection.deleteOne(Filters.eq("userId", userId));
    }

    // --- Helpers ---

    // Save or Update the Cart in MongoDB
    private void saveCart(Cart cart) {
        Document doc = cartToDocument(cart);
        // "upsert": Replace if exists, Insert if new
        cartCollection.replaceOne(Filters.eq("userId", cart.getUserId()), doc, 
                new com.mongodb.client.model.ReplaceOptions().upsert(true));
    }

    // Convert Cart -> Document
    private Document cartToDocument(Cart cart) {
        List<Document> itemDocs = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            itemDocs.add(new Document()
                .append("productId", item.getProductId())
                .append("productName", item.getProductName())
                .append("price", item.getPrice())
                .append("quantity", item.getQuantity())
                .append("image", item.getImages())
            );
        }
        return new Document("userId", cart.getUserId())
                .append("items", itemDocs);
    }
//Convert Document into Cart
    private Cart cartFromDocument(Document doc) {
        Cart cart = new Cart(doc.getString("userId"));
        List<Document> itemDocs = (List<Document>) doc.get("items");
        
        List<CartItem> items = new ArrayList<>();
        if (itemDocs != null) {
        for (Document itemDoc : itemDocs) {

            // Wrapping and conversion to correct data types
            Double priceWrapper = itemDoc.getDouble("price");
            double price = (priceWrapper != null) ? priceWrapper : 0.0;

            Integer qtyWrapper = itemDoc.getInteger("quantity");
            int quantity = (qtyWrapper != null) ? qtyWrapper : 0;
            
            List<String> images = itemDoc.getList("images", String.class);
            if (images == null) {
                images = new ArrayList<>(); 
            }
            //Add each individual cart java object into the list
            items.add(new CartItem(
                itemDoc.getString("productId"),
                itemDoc.getString("productName"),
                price,
                quantity,
                images
            ));
        }
    }

    cart.setItems(items);
    return cart;
}

}
