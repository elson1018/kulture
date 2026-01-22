import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../config/api";
import Popup from "../../components/Popup/Popup";
import "./Checkout.css";

const Checkout = () => {
  const { clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState({ items: [] });
  const [products, setProducts] = useState([]); // this used to check product category
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, msg: "", type: "success" });

  const navigate = useNavigate();

  // Malaysian states list
  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
    "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
    "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur",
    "Labuan", "Putrajaya"
  ];

  const [formData, setFormData] = useState({
    paymentMethod: "cod",
  });

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: ""
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

        const cartRes = await fetch(ENDPOINTS.CART, {
          method: "GET",
          credentials: "include"
        });

        const prodRes = await fetch(ENDPOINTS.PRODUCTS);

        if (cartRes.ok && prodRes.ok) {
          const cData = await cartRes.json();
          const pData = await prodRes.json();
          setCartData(cData);
          setProducts(pData);

          // Pre-fill delivery address from user's saved address
          if (user.address) {
            // Try to parse structured address if it exists
            try {
              const savedAddr = JSON.parse(user.address);
              setDeliveryAddress({
                fullName: savedAddr.fullName || `${user.user_fname || ''} ${user.user_lname || ''}`.trim(),
                phone: savedAddr.phone || "",
                address: savedAddr.address || "",
                city: savedAddr.city || "",
                state: savedAddr.state || "",
                postalCode: savedAddr.postalCode || ""
              });
            } catch {
              // If not JSON, use as simple address string
              setDeliveryAddress(prev => ({
                ...prev,
                fullName: `${user.user_fname || ''} ${user.user_lname || ''}`.trim(),
                address: user.address
              }));
            }
          } else {
            // Set default name from user profile
            setDeliveryAddress(prev => ({
              ...prev,
              fullName: `${user.user_fname || ''} ${user.user_lname || ''}`.trim()
            }));
          }
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
      setShowQR(e.target.value === 'card');
    }
  };

  const handleAddressChange = (e) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const validateDeliveryAddress = () => {
    const { fullName, phone, address, city, state, postalCode } = deliveryAddress;
    if (!fullName || !phone || !address || !city || !state || !postalCode) {
      return false;
    }
    // Basic phone validation (Malaysian format)
    if (!/^01\d{8,9}$/.test(phone.replace(/[\s-]/g, ''))) {
      return false;
    }
    // Postal code validation (Malaysian 5 digits)
    if (!/^\d{5}$/.test(postalCode)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate delivery address
    if (!validateDeliveryAddress()) {
      setPopup({ show: true, msg: "Please fill in all delivery details correctly. Phone should start with 01 and postal code should be 5 digits.", type: "error" });
      return;
    }

    if (formData.paymentMethod === 'card' && !showQR) {
      setShowQR(true);
      return;
    }

    try {
      const response = await fetch(`${ENDPOINTS.CART}?action=checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ deliveryAddress })
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Order Processed:", result.message);
        clearCart();
        setPopup({ show: true, msg: "Order Placed Successfully!", type: "success" });
      } else {
        setPopup({ show: true, msg: "Checkout failed: " + (result.message || "Unknown error"), type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setPopup({ show: true, msg: "An error occurred. Please try again later.", type: "error" });
    }
  };

  const handlePopupClose = () => {
    const wasSuccess = popup.type === "success";
    setPopup({ show: false, msg: "", type: "success" });
    if (wasSuccess) {
      navigate("/");
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
      <Popup
        isOpen={popup.show}
        message={popup.msg}
        type={popup.type}
        onClose={handlePopupClose}
      />
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-container">
        {/* Payment method */}
        <div className="checkout-left">
          <form id="checkout-form" onSubmit={handleSubmit}>
            {/* Delivery Details Section */}
            <section className="form-section delivery-section">
              <h3>Delivery Details</h3>
              <div className="delivery-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryAddress.fullName}
                      onChange={handleAddressChange}
                      placeholder="Recipient's full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryAddress.phone}
                      onChange={handleAddressChange}
                      placeholder="e.g. 0123456789"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={deliveryAddress.address}
                    onChange={handleAddressChange}
                    placeholder="Street address, unit number, building name..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-row three-cols">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select
                      name="state"
                      value={deliveryAddress.state}
                      onChange={handleAddressChange}
                      required
                    >
                      <option value="">Select State</option>
                      {malaysianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={deliveryAddress.postalCode}
                      onChange={handleAddressChange}
                      placeholder="e.g. 50000"
                      maxLength={5}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                  <span>Cash on Delivery</span>
                </label>

                <label className={`payment-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
                  <span>TnG QR</span>
                </label>
              </div>

              {showQR && (
                <div className="qr-section">
                  <p className="qr-instruction">Scan DuitNow QR to Pay:</p>
                  <img src="/qr-payment.png" alt="Payment QR Code" className="qr-image" />
                  <p className="qr-note">Please screenshot receipt after payment as reference.</p>
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
                Place Order
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