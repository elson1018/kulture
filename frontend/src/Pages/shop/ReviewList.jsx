import React from 'react';
import './Review.css';

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <div className="no-reviews">No reviews yet. Be the first to review!</div>;
    }

    return (
        <div className="review-list">
            <h3>Customer Reviews ({reviews.length})</h3>
            {reviews.map((review, index) => (
                <div key={index} className="review-item">
                    <div className="review-header">
                        <span className="review-user">{review.userName || 'Anonymous'}</span>
                        <span className="review-date">
                            {review.timestamp ? new Date(review.timestamp).toLocaleDateString() : ''}
                        </span>
                    </div>
                    <div className="review-rating">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
