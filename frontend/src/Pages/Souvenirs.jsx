import React from 'react';
import '../CSS/Souvenirs.css';
import { products } from '../data/productData.js'; 

const Souvenirs = () => {
  return (
    <div className='shop-page'>
      <div className="shop-header">
        <h1>Souvenirs Marketplace</h1>
        <p>Discover hand-printed textiles and crafts from local Malaysian artisans.</p>
      </div>
        
      <div className="product-grid">
        {products.map((product) => ( 
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image[0]} alt={product.name} /> 
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">RM {product.price.toFixed(2)}</p>
              
              <div className="product-details">
                <span className="product-rating">⭐ {product.rating.toFixed(1)}</span>
                <p className="product-desc">{product.description}</p>
              </div>
              <button className="add-to-cart-btn primary-button">
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Souvenirs