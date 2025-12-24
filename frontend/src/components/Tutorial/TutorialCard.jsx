import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Product/ProductCard.css'; // Reusing ProductCard styles for consistency

const TutorialCard = ({ tutorial }) => {
    const navigate = useNavigate();

    const rawImage = Array.isArray(tutorial.images) && tutorial.images.length > 0
        ? tutorial.images[0]
        : "/products/Tutorials/default.jpeg";

    const imageSrc = rawImage.startsWith("http")
        ? rawImage
        : `${rawImage}`;

    const handleViewDetails = () => {
        navigate(`/tutorial/${tutorial.id}`);
    };

    return (
        <div className="product-card">
            <div className="product-image-container" onClick={handleViewDetails} style={{ cursor: 'pointer' }}>
                <img
                    src={imageSrc}
                    alt={tutorial.name}
                    onError={(e) => { e.target.src = "/products/Tutorials/default.jpeg" }}
                />
            </div>

            <div className="product-info">
                <h3 className="product-name" onClick={handleViewDetails} style={{ cursor: 'pointer' }}>{tutorial.name}</h3>
                <p className="product-price">RM {tutorial.price.toFixed(2)}</p>

                <div className="product-details">
                    <span className="product-rating" style={{ marginBottom: '5px', display: 'block' }}>
                        {tutorial.isLiveClass ? "🔴 Live Class" : "📹 Recorded"}
                    </span>
                    <p className="product-desc" style={{ fontStyle: 'italic', fontSize: '0.9em', color: '#555' }}>
                        Instructor: {tutorial.instructor}
                    </p>
                </div>

                <button className="add-to-cart-btn primary-button" onClick={handleViewDetails}>
                    View Details
                </button>
            </div>
        </div>
    );
};

export default TutorialCard;
