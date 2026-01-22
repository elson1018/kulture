import React, { useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import './ReviewPopup.css';

const ReviewPopup = ({ isOpen, onClose, productId, productName, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.email) {
                throw new Error("You must be logged in to review.");
            }

            const response = await fetch(ENDPOINTS.REVIEWS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    email: user.email,
                    userName: user.user_fname || user.email,
                    rating,
                    comment,
                    action: 'submit'
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to submit review');
            }

            setComment('');
            setRating(5);
            onClose();
            if (onSuccess) onSuccess();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-popup-overlay" onClick={onClose}>
            <div className="review-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-popup-btn" onClick={onClose}>×</button>
                <h3>Write a Review</h3>
                {productName && <p className="popup-product-name">for {productName}</p>}

                {error && <div className="popup-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="popup-form-group">
                        <label>Your Rating</label>
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? 'star active' : 'star'}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="popup-form-group">
                        <label>Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            rows={4}
                            required
                        />
                    </div>
                    <button type="submit" className="popup-submit-btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewPopup;
