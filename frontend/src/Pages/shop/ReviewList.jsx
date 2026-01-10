import React, { useState } from 'react';
import './Review.css';

const ReviewList = ({ reviews }) => {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_REVIEW_COUNT = 6; // Show 6 reviews initially (2 rows x 3 per row)

    if (!reviews || reviews.length === 0) {
        return <div className="no-reviews">No reviews yet. Be the first to review!</div>;
    }

    // Determine which reviews to display
    const reviewsToShow = showAll ? reviews : reviews.slice(0, INITIAL_REVIEW_COUNT);
    const hasMore = reviews.length > INITIAL_REVIEW_COUNT;

    return (
        <div className="review-list">
            <h3>Customer Reviews ({reviews.length})</h3>
            <div className="review-grid">
                {reviewsToShow.map((review, index) => {
                    const initial = review.userName ? review.userName.charAt(0).toUpperCase() : '?';
                    return (
                        <div key={index} className="review-item">
                            <div className="review-header">
                                <div className="review-user-info">
                                    <div className="review-avatar">
                                        {initial}
                                    </div>
                                    <div className="review-user-details">
                                        <span className="review-user">{review.userName || 'Anonymous'}</span>
                                        <span className="review-date">
                                            {review.timestamp ? new Date(review.timestamp).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div className="show-more-container">
                    <button
                        className="show-more-btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less Reviews' : `Show More Reviews (${reviews.length - INITIAL_REVIEW_COUNT} more)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
