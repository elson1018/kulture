import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ENDPOINTS } from '../../config/api';
import ProductCard from '../../components/Product/ProductCard'
import ScrollTopButton from '../../components/ScrollTopButton';
import './ShopCategory.css';

const Souvenirs = () => {
  useDocumentTitle('Souvenirs | Kulture');
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${ENDPOINTS.PRODUCTS}?category=Souvenirs`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        setDisplayProducts(data);
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
      <ScrollTopButton />
    </div>
  );
};

export default Souvenirs;