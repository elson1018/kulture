import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../config/api";
import "../shop/ProductDetail.css";
import "./TutorialDetail.css";
import Popup from "../../components/Popup/Popup";
import { ShopContext } from "../../Context/ShopContext";
import ScrollTopButton from "../../components/ScrollTopButton";

const TutorialDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCartBackend } = useContext(ShopContext);

    const [tutorial, setTutorial] = useState(null);
    const [instructorTutorials, setInstructorTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

    // Popup state
    const [popup, setPopup] = useState({ isOpen: false, message: '', type: '' });

    // Booking states
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('08:00-12:00');
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                setLoading(true);
                const response = await fetch(ENDPOINTS.TUTORIALS);
                if (!response.ok) throw new Error("Failed to fetch tutorials");

                const data = await response.json();
                const found = data.find((t) => String(t.id) === id);

                if (found) {
                    setTutorial(found);
                    if (found.isLiveClass) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setSelectedDate(tomorrow.toISOString().split('T')[0]);
                    }

                    // Get more tutorials by the same instructor
                    const moreTutorials = data
                        .filter(t => t.instructor === found.instructor && t.id !== found.id)
                        .slice(0, 4);
                    setInstructorTutorials(moreTutorials);
                } else {
                    setError("Tutorial not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorial();
    }, [id]);

    const handlePreview = () => {
        setShowPreview(true);
        // Simulate 10 seconds preview
        setTimeout(() => {
            setShowPreview(false);
        }, 10000);
    };

    const initiationAddToCart = () => {
        // Check user login from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopup({
                isOpen: true,
                message: "Please log in to add to cart.",
                type: "notification"
            });
            setTimeout(() => navigate("/login"), 1500); // Redirect after short delay
            return;
        }

        if (tutorial.isLiveClass) {
            setShowBookingModal(true);
            setBookingMessage({ type: '', text: '' });
            setQuantity(1); // Reset quantity when opening modal
        } else {
            handleAddToCart();
        }
    };

    const handleAddToCart = async () => {
        if (tutorial.isLiveClass) {
            const dateObj = new Date(selectedDate);
            const day = dateObj.getDay();
            if (day !== 0 && day !== 5 && day !== 6) {
                setBookingMessage({ type: 'error', text: 'Live classes are only available on Fri, Sat, and Sun.' });
                return;
            }
        }

        setIsAddingToCart(true);
        // The user check is handled in addToCartBackend, but for the modal flow we might want to keep the earlier check "initiationAddToCart".
        // However, safe to rely on backend or context check.

        const finalQty = tutorial.isLiveClass ? quantity : 1;

        const cartItem = {
            productId: tutorial.id,
            productName: tutorial.name,
            price: tutorial.price,
            quantity: finalQty,
            images: tutorial.images || [],

            itemType: tutorial.isLiveClass ? "live_class" : "tutorial",
            selectedDate: tutorial.isLiveClass ? `${selectedDate} (${selectedTime})` : null
        };

        const result = await addToCartBackend(cartItem);

        setIsAddingToCart(false);

        if (result.success) {
            setPopup({ isOpen: true, message: result.message, type: "success" });
            setShowBookingModal(false);
        } else {
            if (result.type === "auth") {
                setPopup({ isOpen: true, message: result.message, type: "error" });
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setBookingMessage({ type: 'error', text: "Failed: " + result.message });
                if (!showBookingModal) {
                    setPopup({ isOpen: true, message: "Failed: " + result.message, type: "error" });
                }
            }
        }
    };

    // Helper to get YouTube ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = tutorial ? getYouTubeId(tutorial.videoUrl) : null;

    if (loading) return <div className="product-detail-page loading"><h2>Loading...</h2></div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!tutorial) return <div className="product-detail-page error"><h2>Tutorial not found</h2></div>;

    return (
        <div className="product-detail-page">
            <Popup
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />

            <div className="detail-container">
                <button className="back-btn" onClick={handleBack}>
                    X CLOSE
                </button>
                <div className="detail-images">
                    <div className="main-image-container">
                        {showPreview ? (
                            <div className="video-preview-container">
                                {/* Show Video Player if videoUrl exists and user wants to preview or watch */}
                                {tutorial.videoUrl ? (
                                    youtubeId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video
                                            controls
                                            autoPlay
                                            width="100%"
                                            height="100%"
                                            poster={tutorial.images?.[0] || "/products/Tutorials/default.jpeg"}
                                        >
                                            <source src={tutorial.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )
                                ) : (
                                    <p>▶ Video Preview Playing (10s)...</p>
                                )}
                            </div>
                        ) : (
                            <img
                                src={tutorial.images?.[0] || "/products/Tutorials/default.jpeg"}
                                alt={tutorial.name}
                                onError={(e) => { e.target.src = "/products/Tutorials/default.jpeg" }}
                            />
                        )}
                    </div>
                </div>

                <div className="detail-info">
                    <p className="detail-category">Tutorials • {tutorial.isLiveClass ? "Live Class" : "Recorded"}</p>
                    <h1>{tutorial.name}</h1>

                    <div className="detail-rating">
                        <span>{tutorial.rating || ""} ⭐</span>
                        <span className="review-count">(Based on user reviews)</span>

                    </div>

                    <div className="detail-instructor">
                        <span>Instructor: {tutorial.instructor}</span>
                    </div>

                    <h2 className="detail-price">RM {tutorial.price.toFixed(2)}</h2>

                    <div className="detail-description">
                        <h3>Description</h3>
                        <p>{tutorial.description}</p>
                    </div>

                    <div className="action-buttons">
                        <button className="buy-now-btn" onClick={handlePreview}>
                            Watch Preview
                        </button>
                        <button className="add-cart-btn" onClick={initiationAddToCart}>
                            {tutorial.isLiveClass ? "Book Live Class" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Modal for Live Class Date Selection */}
            {showBookingModal && (
                <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="booking-modal" onClick={e => e.stopPropagation()}>
                        <h2>Select Date for Live Class</h2>
                        <p className="modal-subtitle">{tutorial.name}</p>

                        <div className="booking-form-fields">
                            <label>Select Date (Fri-Sun):</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                            />

                            <label>Select Slot:</label>
                            <select
                                value={selectedTime}
                                onChange={e => setSelectedTime(e.target.value)}
                            >
                                <option value="08:00-12:00">8:00 AM - 12:00 PM</option>
                                <option value="16:00-20:00">4:00 PM - 8:00 PM</option>
                            </select>

                            <label>Number of Sessions:</label>
                            <div className="modal-quantity-wrapper">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                >-</button>
                                <span>{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => q + 1)}
                                >+</button>
                            </div>
                        </div>

                        <p className={`booking-message ${bookingMessage.type}`}>{bookingMessage.text}</p>

                        <div className="modal-actions">
                            <button
                                className="modal-btn-primary"
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                            >
                                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                className="modal-btn-secondary"
                                onClick={() => setShowBookingModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {instructorTutorials.length > 0 && (
                <section className="related-products">
                    <h2>More by {tutorial.instructor}</h2>
                    <div className="related-grid">
                        {instructorTutorials.map((item) => (
                            <div
                                key={item.id}
                                className="related-card"
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    navigate(`/tutorial/${item.id}`);
                                }}
                            >
                                <div className="related-image">
                                    <img
                                        src={item.images?.[0] || '/products/Tutorials/default.jpeg'}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = '/products/Tutorials/default.jpeg' }}
                                    />
                                    <span className="related-badge">
                                        {item.isLiveClass ? '🔴 Live' : '📹 Recorded'}
                                    </span>
                                </div>
                                <div className="related-info">
                                    <p className="related-name">{item.name}</p>
                                    <p className="related-price">RM {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <ScrollTopButton />
        </div>
    );
};

export default TutorialDetail;
