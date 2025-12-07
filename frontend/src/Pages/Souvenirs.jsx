import React, { useState, useEffect } from 'react';
import '../CSS/Souvenirs.css';
// import { products } from '../data/productData.js'; 

const Souvenirs = () => {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const souvenirItems = data.filter(item => item.category === 'Souvenirs');
        
        setDisplayProducts(souvenirItems);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className='shop-page'><h2 style={{textAlign: 'center'}}>Loading Products...</h2></div>;
  }

  return (
    <div className='shop-page'>
      <div className="shop-header">
        <h1>Souvenirs Marketplace</h1>
        <p>Discover hand-printed textiles and crafts from local Malaysian artisans.</p>
      </div>
        
      <div className="product-grid">
        {displayProducts.map((product) => {
          const imageList = product.images || product.image || [];
          const mainImage = imageList.length > 0 ? imageList[0] : "/products/placeholder.jpg";

          return (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={mainImage} 
                  alt={product.name}
                  onError={(e) => {e.target.src = "/products/placeholder.jpg"}} 
                /> 
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">RM {product.price.toFixed(2)}</p>
                
                <div className="product-details">
                  <span className="product-rating">⭐ {product.rating || "New"}</span>
                  <p className="product-desc">{product.description}</p>
                </div>
                <button className="add-to-cart-btn primary-button">
                  View Product
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Souvenirs;