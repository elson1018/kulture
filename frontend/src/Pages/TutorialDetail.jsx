import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/ProductDetail.css"; // Reuse ProductDetail styles
import Popup from "../components/Popup/Popup";

const TutorialDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tutorial, setTutorial] = useState(null);
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
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/tutorials");
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
        // Simulate 5 seconds preview
        setTimeout(() => {
            setShowPreview(false);
            // Small delay to allow React to unmount the video/iframe before alert blocks the UI
            setTimeout(() => {
                setPopup({
                    isOpen: true,
                    message: "Preview ended. Please purchase to watch the full tutorial.",
                    type: "notification"
                });
            }, 100);
        }, 5000);
    };

    const handleBookOrBuy = async () => {
        // Check user login from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopup({
                isOpen: true,
                message: "Please log in to book or purchase.",
                type: "notification"
            });
            setTimeout(() => navigate("/login"), 1500); // Redirect after short delay
            return;
        }

        setShowBookingModal(true);
        setBookingMessage({ type: '', text: '' });
    };

    const confirmBooking = async () => {
        // Booking logic (reused from Tutorial.jsx)
        if (tutorial.isLiveClass) {
            const dateObj = new Date(selectedDate);
            const day = dateObj.getDay();
            if (day !== 0 && day !== 5 && day !== 6) {
                setBookingMessage({ type: 'error', text: 'Live classes are only available on Fri, Sat, and Sun.' });
                return;
            }
        }

        const user = JSON.parse(localStorage.getItem('user'));
        setIsBooking(true);
        try {
            const response = await fetch(`http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tutorialId: tutorial.id,
                    userEmail: user.email,
                    scheduledDate: tutorial.isLiveClass ? `${selectedDate} (${selectedTime})` : null,
                    status: tutorial.isLiveClass ? 'Upcoming' : 'Purchased'
                }),
            });

            if (response.ok) {
                setBookingMessage({ type: 'success', text: 'Success! View in Settings.' });
                setTimeout(() => setShowBookingModal(false), 2000);
            } else {
                throw new Error('Booking failed');
            }
        } catch (err) {
            setBookingMessage({ type: 'error', text: err.message });
        } finally {
            setIsBooking(false);
        }
    };

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
                <div className="detail-images">
                    <div className="main-image-container">
                        {showPreview ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
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
                                            style={{ backgroundColor: '#000' }}
                                        >
                                            <source src={tutorial.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )
                                ) : (
                                    <p>▶ Video Preview Playing (5s)...</p>
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
                        <span>Instructor: {tutorial.instructor}</span>
                    </div>

                    <h2 className="detail-price">RM {tutorial.price.toFixed(2)}</h2>

                    <div className="detail-description">
                        <h3>Description</h3>
                        <p>{tutorial.description}</p>
                    </div>

                    <div className="action-buttons">
                        {!tutorial.isLiveClass && (
                            <button className="add-cart-btn" onClick={handlePreview} style={{ backgroundColor: '#555' }}>
                                Watch Preview
                            </button>
                        )}
                        <button className="buy-now-btn" onClick={handleBookOrBuy}>
                            {tutorial.isLiveClass ? "Book Live Class" : "Buy Full Course"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay" onClick={() => setShowBookingModal(false)} style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                        background: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%'
                    }}>
                        <h2>Confirm {tutorial.isLiveClass ? 'Booking' : 'Purchase'}</h2>
                        <p>{tutorial.name}</p>

                        {tutorial.isLiveClass && (
                            <div className="datetime-fields" style={{ margin: '15px 0' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Select Date (Fri-Sun):</label>
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

                                <label style={{ display: 'block', marginBottom: '5px' }}>Select Slot:</label>
                                <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                                    <option value="08:00-12:00">8:00 AM - 12:00 PM</option>
                                    <option value="16:00-20:00">4:00 PM - 8:00 PM</option>
                                </select>
                            </div>
                        )}

                        <p className={`message ${bookingMessage.type}`} style={{
                            color: bookingMessage.type === 'error' ? 'red' : 'green', margin: '10px 0'
                        }}>{bookingMessage.text}</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button onClick={confirmBooking} disabled={isBooking} style={{
                                padding: '10px 20px', background: '#D9944E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
                            }}>
                                {isBooking ? 'Processing...' : 'Confirm'}
                            </button>
                            <button onClick={() => setShowBookingModal(false)} style={{
                                padding: '10px 20px', background: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer'
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorialDetail;
