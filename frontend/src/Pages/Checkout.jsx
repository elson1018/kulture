import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import "../CSS/Checkout.css";

const Checkout = () => {
  const { cartItems, getTotalCartItems , clearCart} = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paymentMethod: "cod", // by default cash on delivery
  });

  //  rm8.00 for shipping fee default
  const shippingFee = 8.00;

  // fetch the products
  useEffect(() => {
    fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products for checkout", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
          const response = await fetch(
              "http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart?action=checkout",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  // Crucial: send cookies so the backend knows which user is checking out
                  credentials: "include",
              }
          );

          const result = await response.json();

          if (response.ok) {
              console.log("Order Processed:", result.message);
              clearCart();
              alert("Order Placed Successfully!");
              // Redirect to a success page or home
              navigate("/");
          } else {
              console.error("Backend Error:", result);
              alert("Checkout failed: " + (result.message || result.error || "Unknown error"));
          }
      } catch (error) {
          console.error("Error during checkout:", error);
          alert("An error occurred. Please try again later.");
      }
    navigate("/"); 
  }; 

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = products.find(
          (product) => product.id === String(item) || product.id === parseInt(item)
        );
        
        if (itemInfo) {
          // this is to check if the item is instrument then apply 10% discount on it
          const finalPrice = itemInfo.category === "Instruments" 
            ? itemInfo.price * 0.90 
            : itemInfo.price;

          totalAmount += cartItems[item] * finalPrice;
        }
      }
    }
    return totalAmount;
  };

  const getOriginalCartAmount = () => { // this is without discount one
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = products.find(
          (product) => product.id === String(item) || product.id === parseInt(item)
        );
        if (itemInfo) {
          totalAmount += cartItems[item] * itemInfo.price;
        }
      }
    }
    return totalAmount;
  };

  // calculate total
  const finalSubTotal = getTotalCartAmount(); // total price user pays for items
  const originalAmount = getOriginalCartAmount(); // total price before discount
  const discountAmount = originalAmount - finalSubTotal; // total discount value
  const grandTotal = finalSubTotal + shippingFee;

  if (getTotalCartItems() === 0 && products.length > 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/shop")} className="btn-primary">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-container">
        {/* Payment method */}
        <div className="checkout-left">
          <form id="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
                
                <label className={`payment-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                  />
                  <span>Credit / Debit Card</span>
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Summary of order */}
        <div className="checkout-right">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {products.map((product) => {
                if (cartItems[product.id] > 0) {
                  return (
                    <div key={product.id} className="summary-item">
                      <div className="item-info">
                        <span className="item-name">{product.name}</span>
                        <span className="item-qty">x {cartItems[product.id]}</span>
                      </div>
                      <span className="item-price">
                        RM {(product.price * cartItems[product.id]).toFixed(2)}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            <div className="summary-divider"></div>
            
            {/* price breakdown */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>RM {originalAmount.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && ( // display total discount value
              <div className="summary-row">
                <span>Discount</span>
                <span>- RM {discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>RM {shippingFee.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>RM {grandTotal.toFixed(2)}</span>
            </div>

            <div className="checkout-actions">
               <button 
                  type="submit" 
                  form="checkout-form" 
                  className="btn-primary full-width-btn"
                >
                  Place Order
               </button>
               <button 
                  type="button" 
                  onClick={() => navigate("/cart")} 
                  className="btn-secondary full-width-btn"
                >
                  Back to Cart
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;