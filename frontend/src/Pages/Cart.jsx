import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import bin_icon from "../assets/bin.png";
import "../CSS/Cart.css";

const Cart = () => {
  const { cartItems, getTotalCartItems, updateCartItemCount } = useContext(ShopContext);

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Error fetching products for cart page", err)
      );
  }, []);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = products.find(
          (product) =>
            product.id === String(item) || product.id === parseInt(item)
        );
        if (itemInfo) {
          totalAmount += cartItems[item] * itemInfo.price;
        }
      }
    }
    return totalAmount;
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Your Cart</h1>
      </div>

      <div className="cart-items">
        {products.map((product) => {
          if (cartItems[product.id] > 0) {
            const rawImage =
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : "/products/placeholder.jpg";
            const imageSrc = rawImage.startsWith("http")
              ? rawImage
              : `${rawImage}`;

            return (
              <div key={product.id} className="cart-item">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="cart-product-image"
                  onError={(e) => {
                    e.target.src = "/products/placeholder.jpg";
                  }}
                />

                <div className="cart-description">
                  <p className="cart-product-name">
                    <b>{product.name}</b>
                  </p>
                  <p className="cart-product-price">RM {product.price.toFixed(2)}</p>
                </div>

                <div className="quantity-wrapper">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateCartItemCount(
                        Math.max(1, cartItems[product.id] - 1),
                        product.id
                      )
                    }
                  >
                    -
                  </button>
                  <span className="quantity-display">{cartItems[product.id]}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateCartItemCount(cartItems[product.id] + 1, product.id)
                    }
                  >
                    +
                  </button>
                </div>

                {/* i added remove button here */}
                <button 
                  className="remove-btn"
                  title="Remove Item"
                  onClick={() => updateCartItemCount(0, product.id)}
                >
                  <img src={bin_icon} alt="Remove" />
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>

      {getTotalCartItems() > 0 ? (
        <div className="checkout-summary">
          <h2>Subtotal: RM {getTotalCartAmount().toFixed(2)}</h2>
          <div className="checkout-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate("/shop")}
            >
              Continue Shopping
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/checkout")}
            >
              Go to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart"> {/* show navigate button if the cart is empty */}
            <h2>Your Shopping Cart is Empty</h2>
            <button 
                className="btn-primary" 
                onClick={() => navigate("/shop")}
            >
                Start Shopping
            </button>
        </div>
      )}
    </div>
  );
};

export default Cart;