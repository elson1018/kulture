import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../../config/api';
import ProductCard from '../../components/Product/ProductCard'
import './Souvenirs.css';

const Souvenirs = () => {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(ENDPOINTS.PRODUCTS);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        // show only souvenirs product
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
    return (
      <div className='shop-page loading-state'>
        <h2>Loading Products...</h2>
      </div>
    );
  }

  return (
    <div className='shop-page'>
      <div className="shop-header">
        <h1>Souvenirs Marketplace</h1>
        <p>Discover hand-printed textiles and crafts from local Malaysian artisans.</p>
      </div>
        
      <div className="product-grid">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Souvenirs;