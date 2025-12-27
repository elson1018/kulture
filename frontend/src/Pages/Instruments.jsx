import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config/api';
import ProductCard from '../components/Product/ProductCard'
import '../CSS/Instruments.css';

const Instruments = () => {
  const [products, setProduct] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(ENDPOINTS.PRODUCTS);

        if (!response.ok) {
            throw new Error(`HTTP ERROR Status: ${response.status}`);
        }

        const productData = await response.json();
        
        const instrumentData = productData.filter(items => items.category === "Instruments");
        
        setProduct(instrumentData);

      } catch (error) {
        console.log("Error fetching " + error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
      return (
        <div className='shop-page' style={{paddingTop: '100px'}}>
            <h2 style={{textAlign: 'center'}}>Loading Instruments...</h2>
        </div>
      );
  }

  if (error) {
       return (
        <div className='shop-page' style={{paddingTop: '100px'}}>
            <h2 style={{textAlign: 'center', color: 'red'}}>Error: {error}</h2>
        </div>
       );
  }

  return (
    <div className='shop-page'>
        <div className="shop-header">
            <h1>Instruments Marketplace</h1>
            <p>Discover traditional and modern musical instruments.</p>
        </div>
        
        <div className="product-grid">
          {products.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {!isLoading && products.length === 0 && (
             <p id='empty-product-message' style={{textAlign: 'center', marginTop: '40px'}}>
                No instruments found.
             </p>
        )}
    </div>
  );
};

export default Instruments;