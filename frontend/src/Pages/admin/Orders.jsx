import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../config/api";
import ReviewPopup from "../../components/ReviewPopup/ReviewPopup";
import Popup from "../../components/Popup/Popup";
import "./Orders.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Review popup state
    const [reviewPopup, setReviewPopup] = useState({
        isOpen: false,
        productId: null,
        productName: null
    });

    const openReviewPopup = (productId, productName) => {
        setReviewPopup({ isOpen: true, productId, productName });
    };

    const closeReviewPopup = () => {
        setReviewPopup({ isOpen: false, productId: null, productName: null });
    };

    // Success popup state
    const [successPopup, setSuccessPopup] = useState(false);

    const handleReviewSuccess = () => {
        setSuccessPopup(true);
    };

    const closeSuccessPopup = () => {
        setSuccessPopup(false);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // get user email from local storage
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.email) {
                    setError("Please log in to view your orders");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${ENDPOINTS.SALES}?email=${encodeURIComponent(user.email)}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await response.json();
                // sort orders by date
                const sortedOrders = (data.sales || []).sort(
                    (a, b) => new Date(b.saleDate) - new Date(a.saleDate)
                );
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-header">
                    <h1>My Orders</h1>
                </div>
                <div className="loading-state">
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-header">
                    <h1>My Orders</h1>
                </div>
                <div className="error-state">
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Review Popup */}
            <ReviewPopup
                isOpen={reviewPopup.isOpen}
                onClose={closeReviewPopup}
                productId={reviewPopup.productId}
                productName={reviewPopup.productName}
                onSuccess={handleReviewSuccess}
            />

            {/* Success Popup */}
            <Popup
                isOpen={successPopup}
                message="Review submitted successfully!"
                type="success"
                onClose={closeSuccessPopup}
            />

            <div className="orders-header">
                <h1>My Orders</h1>
                <p className="orders-subtitle">
                    View and track your purchase history
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <div className="empty-orders-icon">📦</div>
                    <h2>No Orders Yet</h2>
                    <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
                    <button className="btn-primary" onClick={() => navigate("/shop")}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="orders-container">
                    <div className="orders-stats">
                        <div className="stat-card">
                            <h3>Total Orders</h3>
                            <p>{orders.length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Spent</h3>
                            <p>RM {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <div key={order.id || index} className="order-card">
                                <div className="order-card-header">
                                    <div className="order-info">
                                        <h3 className="order-number">Order #{index + 1}</h3>
                                        <p className="order-date">{formatDate(order.saleDate)}</p>
                                    </div>
                                    <div className="order-status">
                                        <span className="status-badge completed">Completed</span>
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-items">
                                        <h4>Items Ordered:</h4>
                                        <ul className="items-list">
                                            {order.productNames.map((productName, idx) => {
                                                const productId = order.productIds ? order.productIds[idx] : null;
                                                return (
                                                    <li key={idx} className="order-item-row">
                                                        <div>
                                                            <span className="item-bullet">•</span>
                                                            <span className="item-name">{productName}</span>
                                                        </div>
                                                        {productId && (
                                                            <button
                                                                className="give-review-btn"
                                                                onClick={() => openReviewPopup(productId, productName)}
                                                            >
                                                                Give Review
                                                            </button>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>


                                </div>

                                <div className="order-card-footer">
                                    <div className="order-total">
                                        <span className="total-label">Total Amount:</span>
                                        <span className="total-amount">RM {order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;