import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'
import Popup from "../../components/Popup/Popup";
import { ShopContext } from "../../Context/ShopContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCartBackend } = useContext(ShopContext);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "" });

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

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click
    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      images: product.images || [],

    };

    const result = await addToCartBackend(cartItem);
    if (result.success) {
      setPopup({ isOpen: true, message: result.message, type: "success" });
    } else {
      if (result.type === "auth") navigate("/login");
      else setPopup({ isOpen: true, message: result.message, type: "error" });
    }
  };
  { console.log("Current Product Image:", imageSrc); }

  return (
    <div className="product-card">
      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
      <div className="product-image-container clickable" onClick={handleViewDetails}>
        <img
          src={imageSrc}
          alt={product.name}
          onError={(e) => {e.target.src = "/products/placeholder.jpg"}} 
        />
      </div>

      <div className="product-info">
        {/* The class here must match the CSS (.product-name) */}
        <h3 className="product-name clickable" onClick={handleViewDetails}>
          {product.name}
        </h3>

        <div className="product-details">
          <span className="product-rating">⭐ {product.rating || "New"}</span>

          <p className="product-desc">
            {product.description ? product.description : "No description available."}
          </p>
        </div>

        <button className="add-to-cart-btn primary-button" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;