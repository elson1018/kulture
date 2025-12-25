import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import "../CSS/Checkout.css";

const Checkout = () => {
  const { clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState({ items: [] });
  const [products, setProducts] = useState([]); // this used to check product category
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paymentMethod: "cod", 
  });

  const [showQR, setShowQR] = useState(false);
  const shippingFee = 8.00;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          navigate("/login");
          return;
        }

        const cartRes = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart", {
          method: "GET",
          credentials: "include"
        });
        
        const prodRes = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products");

        if (cartRes.ok && prodRes.ok) {
          const cData = await cartRes.json();
          const pData = await prodRes.json();
          setCartData(cData);
          setProducts(pData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'paymentMethod') {
      setShowQR(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === 'card' && !showQR) {
      setShowQR(true);
      return; 
    }

    try {
      const response = await fetch(
        "http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart?action=checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Order Processed:", result.message);
        clearCart();
        alert("Order Placed Successfully!");
        navigate("/");
      } else {
        alert("Checkout failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const calculateTotals = () => {
    let original = 0;
    let final = 0;

    if (cartData.items) {
      cartData.items.forEach((item) => {
        const productDetails = products.find(p => p.id === item.productId);
        
        const itemOriginalTotal = item.price * item.quantity;
        original += itemOriginalTotal;

        // if instrument then apply 10% discount
        if (productDetails && productDetails.category === "Instruments") {
          final += itemOriginalTotal * 0.90; 
        } else {
          final += itemOriginalTotal;
        }
      });
    }

    return {
      originalAmount: original,
      finalSubTotal: final,
      discountAmount: original - final,
      grandTotal: final + shippingFee
    };
  };

  const { originalAmount, discountAmount, grandTotal } = calculateTotals();

  if (loading) return <div className="checkout-page"><h2>Loading...</h2></div>;

  if (!cartData.items || cartData.items.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/shop")} className="btn-primary">Return to Shop</button>
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
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                  <span>Cash on Delivery</span>
                </label>
                
                <label className={`payment-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
                  <span>Credit / Debit Card</span>
                </label>
              </div>

              {showQR && (
                <div className="qr-section">
                  <p className="qr-instruction">Scan DuitNow QR to Pay:</p>
                  <img src="/qr-payment.png" alt="Payment QR Code" className="qr-image" />
                  <p className="qr-note">Please screenshot receipt after payment.</p>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* Summary of order */}
        <div className="checkout-right">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartData.items.map((item) => {

                // to check if this specific item gets a discount for the display label
                const productDetails = products.find(p => p.id === item.productId);
                const isInstrument = productDetails?.category === "Instruments";
                const displayPrice = item.price;

                return (
                  <div key={`${item.productId}-${item.selectedDate || 'def'}`} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">
                        {item.productName}
                      </span>
                      <span className="item-qty">x {item.quantity}</span>
                      {item.selectedDate && (
                        <span className="item-date">
                          📅 {item.selectedDate}
                        </span>
                      )}
                    </div>
                    <span className="item-price">
                      RM {(displayPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>RM {originalAmount.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row discount">
                <span>Total Discount</span>
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
               <button type="submit" form="checkout-form" className="btn-primary full-width-btn">
                  {showQR ? "I Have Paid" : "Place Order"}
               </button>
               <button type="button" onClick={() => navigate("/cart")} className="btn-secondary full-width-btn">
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