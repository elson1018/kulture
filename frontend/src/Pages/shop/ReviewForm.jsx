import React, { useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import './Review.css';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            alert('Review submitted successfully!');
            if (onReviewSubmitted) onReviewSubmitted();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-container">
            <h4>Write a Review</h4>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="review-form-group">
                    <label>Rating</label>
                    <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? 'active' : ''}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div className="review-form-group">
                    <label>Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        required
                    />
                </div>
                <button type="submit" className="submit-review-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
