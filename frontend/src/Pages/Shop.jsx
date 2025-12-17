import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Product/ProductCard';
import '../CSS/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchFilterProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products from backed
        const response = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products");

        if (!response.ok) {
            throw new Error(`HTTP ERROR Status: ${response.status}`);
        }

        const allData = await response.json();
        
        // Filter logic
        let filteredData = allData;

        // If there is a search term, filter by name
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filteredData = allData.filter(item => 
                item.name.toLowerCase().includes(lowerTerm) || 
                (item.description && item.description.toLowerCase().includes(lowerTerm))
            );
        }
        
        // 3. Update state
        setProducts(filteredData);

      } catch (error) {
        console.log("Error fetching " + error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFilterProducts();
  }, [searchTerm]);

  // Loading
  if (isLoading) {
    return (
      <div className='shop-page' style={{paddingTop: '100px'}}>
        <h2 style={{textAlign: 'center'}}>Searching Products...</h2>
      </div>
    );
  }

  // Show error
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
        {searchTerm ? (
          <h1>Results for "{searchTerm}"</h1>
        ) : (
          <h1>All Products</h1>
        )}
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {!isLoading && products.length === 0 && (
        <p id='empty-product-message' style={{textAlign: 'center', marginTop: '40px'}}>
          No products found matching "{searchTerm}".
        </p>
      )}
    </div>
  );
};

export default Shop;