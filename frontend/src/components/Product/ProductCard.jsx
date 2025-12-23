import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'
const BACKEND_URL = "http://localhost:8082/MappingServlets-1.0-SNAPSHOT";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const rawImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : "/products/placeholder.jpg";

  const imageSrc = rawImage.startsWith("http") 
    ? rawImage 
    : `${rawImage}`;
  

  const handleViewDetails = () => {
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  };
  {console.log("Current Product Image:", imageSrc);}

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
        {/* The class here must match the CSS (.product-name) */}
        <h3 className="product-name" onClick={handleViewDetails} style={{cursor: 'pointer'}}>
            {product.name}
        </h3>
        
        <div className="product-details">
          <span className="product-rating">⭐ {product.rating || "New"}</span>
        
          <p className="product-desc">
            {product.description ? product.description : "No description available."}
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