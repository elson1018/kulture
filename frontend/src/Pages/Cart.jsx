import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import bin_icon from "../assets/bin.png";
import "../CSS/Cart.css";

const Cart = () => {
   
    const { addToCart, removeFromCart: contextRemove, updateCartItemCount } = useContext(ShopContext);

    const [cartData, setCartData] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    

    useEffect(() => {
      const fetchCart = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                // Not logged in or handled by context redirect usually
                setLoading(false);
                return;
            }

            const response = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart", {
                method: "GET",
                credentials: "include"
            });
            
            if (response.ok) {
                const data = await response.json();
                setCartData(data);

            } else {
                console.error("Failed to fetch cart");
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
        } finally {
            setLoading(false);
        }
    };
        fetchCart();
    }, []);

    const handleRemoveItem = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart?productId=${productId}`, {
                method: "DELETE",
                credentials: "include"
            });
            
            if (response.ok) {
                // Remove from local state immediately for UI responsiveness
                setCartData(prev => ({
                    ...prev,
                    items: prev.items.filter(item => item.productId !== productId)
                }));
                // Update context
                contextRemove(productId);
            }
        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };

    // Helper to create unique key for cart items (productId + selectedDate)
    const getItemKey = (item) => `${item.productId}-${item.selectedDate || 'default'}`;

    const handleQuantityChange = async (item, change) => {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return;
        
        const itemKey = getItemKey(item);
        const updatedItems = cartData.items.map(i => 
            getItemKey(i) === itemKey ? { ...i, quantity: newQuantity } : i
        );
        setCartData({ ...cartData, items: updatedItems });
        
        
        
        const delta = change;
        
        try {
             const payload = {
                 ...item,
                 quantity: delta
             };
             
             const response = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                 updateCartItemCount(newQuantity, item.productId); // Update context
            } else {
                // Revert if failed
                fetchCart(); 
            }
        } catch (e) {
            fetchCart();
        }
    };

    const getTotalCartAmount = () => {
        if (!cartData.items) return 0;
        return cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    return (
        <div className="shop-page">
            <div className="shop-header">
                <h1>Your Cart</h1>
            </div>

            <div className="cart-items">
                {cartData.items && cartData.items.length > 0 ? (
                    cartData.items.map((item) => {
                        const rawImage = (item.images && item.images.length > 0) ? item.images[0] : "/products/placeholder.jpg";
                        const imageSrc = rawImage.startsWith("http") ? rawImage : `${rawImage}`;
                        
                        // Metadata Display
                        const isLiveClass = item.itemType === 'live_class';
                        
                        return (
                            <div key={`${item.productId}-${item.selectedDate || 'def'}`} className="cart-item">
                                <img
                                    src={imageSrc}
                                    alt={item.productName}
                                    className="cart-product-image"
                                    onError={(e) => { e.target.src = "/products/placeholder.jpg"; }}
                                />

                                <div className="cart-description">
                                    <p className="cart-product-name">
                                        <b>{item.productName}</b>
                                    </p>
                                    <p className="cart-product-price">RM {item.price.toFixed(2)}</p>
                                    
                                    {/* Display Metadata */}
                                    {isLiveClass && (
                                        <p className="cart-item-meta" style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                            📅 Date: {item.selectedDate}
                                        </p>
                                    )}
                                    {item.itemType === 'tutorial' && (
                                        <p className="cart-item-meta" style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                            📹 Recorded Course
                                        </p>
                                    )}
                                </div>

                                <div className="quantity-wrapper">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(item, -1)}
                                        disabled={item.quantity <= 1} // Disable -1 if qty is 1, user should use Trash icon
                                    >
                                        -
                                    </button>
                                    <span className="quantity-display">{item.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(item, 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="remove-btn"
                                    title="Remove Item"
                                    onClick={() => handleRemoveItem(item.productId)}
                                >
                                    <img src={bin_icon} alt="Remove" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    !loading && (
                        <div className="empty-cart">
                            <h2>Your Shopping Cart is Empty</h2>
                            <button className="btn-primary" onClick={() => navigate("/shop")}>
                                Start Shopping
                            </button>
                        </div>
                    )
                )}
            </div>

            {cartData.items && cartData.items.length > 0 && (
                <div className="checkout-summary">
                    <h2>Subtotal: RM {getTotalCartAmount().toFixed(2)}</h2>
                    <div className="checkout-actions">
                        <button className="btn-secondary" onClick={() => navigate("/shop")}>
                            Continue Shopping
                        </button>
                        <button className="btn-primary" onClick={() => navigate("/checkout")}>
                            Go to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;