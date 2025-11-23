import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/productData';
import '../CSS/Shop.css';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-not-found">
          <h2>Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-price">RM {product.price.toFixed(2)}</p>
          <div className="product-rating">
            <span>Rating: {product.rating} ⭐</span>
          </div>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

