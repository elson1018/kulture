
package com.example.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.example.util.MongoDBUtil;
import com.example.model.Cart;
import com.example.model.CartItem;
import org.bson.Document;
import java.util.ArrayList;
import java.util.List;

public class CartDAO {
    private MongoCollection<Document> cartCollection;

    public CartDAO() {
        MongoDatabase database = MongoDBUtil.getDatabase();
        this.cartCollection = database.getCollection("carts");
    }

    // Get Cart function
    public Cart getCart(String userId) {
        Document doc = cartCollection.find(Filters.eq("userId", userId)).first();
        if (doc == null) {
            return new Cart(userId);
        }
        return cartFromDocument(doc);
    }

    public List<CartItem> getCartItems(String userId) {
        Cart cart = getCart(userId);
        if (cart != null && cart.getItems() != null) {
            return cart.getItems();
        }
        return new ArrayList<>();
    }

    // Add to cart function
    public void addToCart(String userId, CartItem newItem) {
        Cart cart = getCart(userId);
        boolean itemExists = false;

        // Check if product is already in cart
        for (CartItem item : cart.getItems()) {
            boolean sameProduct = item.getProductId().equals(newItem.getProductId());
            boolean sameDate = (item.getSelectedDate() == null && newItem.getSelectedDate() == null) ||
                    (item.getSelectedDate() != null && item.getSelectedDate().equals(newItem.getSelectedDate()));

            if (sameProduct && sameDate) {
                int newQuantity = item.getQuantity() + newItem.getQuantity();
                item.setQuantity(Math.max(1, newQuantity));
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
                    .append("images", item.getImages())
                    .append("company", item.getCompany())
                    .append("itemType", item.getItemType())
                    .append("selectedDate", item.getSelectedDate()));
        }
        return new Document("userId", cart.getUserId())
                .append("items", itemDocs);
    }

    // Convert Document into Cart
    private Cart cartFromDocument(Document doc) {
        Cart cart = new Cart(doc.getString("userId"));
        List<Document> itemDocs = (List<Document>) doc.get("items");

        List<CartItem> items = new ArrayList<>();
        if (itemDocs != null) {
            for (Document itemDoc : itemDocs) {

                Object priceObj = itemDoc.get("price");
                double price = 0.0;
                if (priceObj instanceof Number) {
                    price = ((Number) priceObj).doubleValue();
                } else if (priceObj instanceof String) {
                    // Fallback for string representation just in case
                    try {
                        price = Double.parseDouble((String) priceObj);
                    } catch (NumberFormatException e) {
                        price = 0.0;
                    }
                }

                Integer qtyWrapper = itemDoc.getInteger("quantity");
                int quantity = (qtyWrapper != null) ? qtyWrapper : 0;

                List<String> images = itemDoc.getList("images", String.class);
                if (images == null) {
                    images = new ArrayList<>();
                }
                // Add each individual cart java object into the list
                items.add(new CartItem(
                        itemDoc.getString("productId"),
                        itemDoc.getString("productName"),
                        price,
                        quantity,
                        images,
                        itemDoc.getString("company"),
                        itemDoc.getString("itemType"),
                        itemDoc.getString("selectedDate")));
            }
        }

        cart.setItems(items);
        return cart;
    }

}
