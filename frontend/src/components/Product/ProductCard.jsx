import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const imageSrc = Array.isArray(product.image) && product.image.length > 0 
    ? product.image[0] 
    : (typeof product.image === 'string' && product.image ? product.image : "/products/placeholder.jpg");

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container" onClick={handleViewDetails} style={{cursor: 'pointer'}}>
        <img 
          src={imageSrc} 
          alt={product.name}
          onError={(e) => {e.target.src = "/products/placeholder.jpg"}} 
        /> 
      </div>
      
      <div className="product-info">
        <h3 className="product-name" onClick={handleViewDetails} style={{cursor: 'pointer'}}>{product.name}</h3>
        <p className="product-price">RM {product.price.toFixed(2)}</p>
        
        <div className="product-details">
          <span className="product-rating">⭐ {product.rating || "New"}</span>
          {/* This will truncate the description if it's too long for the card */}
          <p className="product-desc">
            {product.description && product.description.length > 60 
              ? product.description.substring(0, 60) + "..." 
              : product.description}
          </p>
        </div>

        <button className="add-to-cart-btn primary-button" onClick={handleViewDetails}>
          View Product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;