import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import "../CSS/Souvenirs.css";
import "../CSS/ProductDetail.css"; // Reuse quantity styles from product detail

const Checkout = () => {
  // Get all the tools we need from our Context
  const { cartItems, getTotalCartItems } = useContext(ShopContext);

  // We need a local list of products to know the Prices and Names
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch product data again so we can calculate prices
  useEffect(() => {
    fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Error fetching products for checkout", err)
      );
  }, []);

  // Function to calculate Total Price (Price * Quantity)
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    let shippingfee = 8;
    // Look through every item in the cart
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // Find the specific product details (price, name) from our products list
        let itemInfo = products.find(
          (product) =>
            product.id === String(item) || product.id === parseInt(item)
        );

        if (itemInfo) {
          // Math: Quantity * Price
          totalAmount += cartItems[item] * itemInfo.price;
        }
      } 
    }
    return (totalAmount + shippingfee); // Added shipping fee here
  };

  return (
    <div className="shop-page" style={{ paddingTop: "100px" }}>
      <div className="shop-header">
        <h1>Checkout</h1>
        <p>Review your order and proceed to payment.</p>
      </div>

      <div
        className="cart-items"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Loop through ALL products, but only show the ones in our cart */}
        {products.map((product) => {
          if (cartItems[product.id] > 0) {
            // Match the image handling used in ProductCard.jsx
            const rawImage =
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : "/products/placeholder.jpg";
            const imageSrc = rawImage.startsWith("http")
              ? rawImage
              : `${rawImage}`;

            return (
              <div
                key={product.id}
                className="cart-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {/* Product Image - consistent with ProductCard.jsx */}
                <img
                  src={imageSrc}
                  alt={product.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginRight: "20px",
                  }}
                  onError={(e) => {
                    e.target.src = "/products/placeholder.jpg";
                  }}
                />

                {/* Name and Price */}
                <div className="description" style={{ flexGrow: 1 }}>
                  <p>
                    <b>{product.name}</b>
                  </p>
                  <p>RM {product.price.toFixed(2)}</p>
                </div>

                {/* Quantity display only on Checkout (no changes here) */}
                <div style={{ minWidth: "80px", textAlign: "center" }}>
                  <span>x {cartItems[product.id]}</span>
                </div>
              </div>
            );
          }
          return null; // Don't show products not in the cart
        })}
      </div>

      {/* Conditional Rendering: Show totals only if cart is not empty */}
      {getTotalCartItems() > 0 ? (
        <div
          className="checkout-summary"
          style={{ maxWidth: "800px", margin: "40px auto", textAlign: "right" }}
        >
          <p>Shipping Fee: RM 8.00</p> {/* Added shipping fee here */}
          <h2>Subtotal: RM {getTotalCartAmount().toFixed(2)}</h2>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={() => navigate("/cart")}
              style={{
                padding: "10px 20px",
                background: "white",
                color: "#4A3C34",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate("/shop")}
              style={{
                padding: "10px 20px",
                background: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </button>
            <button
              style={{
                padding: "10px 20px",
                background: "#D9944E",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Pay Now
            </button>
          </div>
        </div>
      ) : (
        <h2 style={{ textAlign: "center" }}> Your Shopping Cart is Empty</h2>
      )}
    </div>
  );
};

export default Checkout;
