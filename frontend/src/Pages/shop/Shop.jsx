import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../config/api';
import ProductCard from '../../components/Product/ProductCard';
import TutorialCard from '../../components/Tutorial/TutorialCard';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchFilterProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products from backed
        // Fetch products and tutorials in parallel
        const [productsParam, tutorialsParam] = await Promise.all([
          fetch(ENDPOINTS.PRODUCTS),
          fetch(ENDPOINTS.TUTORIALS)
        ]);

        if (!productsParam.ok || !tutorialsParam.ok) {
          throw new Error(`HTTP ERROR Status: ${response.status}`);
        }

        const productsData = await productsParam.json();
        const tutorialsData = await tutorialsParam.json();

        // Combine them
        const allData = [...productsData, ...tutorialsData];

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
      <div className='shop-page loading-state'>
        <h2>Searching Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className='shop-page error-state'>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className='shop-page'>
      <div className="shop-header">
        {searchTerm && (
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        {searchTerm ? (
          <h1>Results for "{searchTerm}"</h1>
        ) : (
          <h1>All Products</h1>
        )}
      </div>

      <div className="product-grid">
        {products.map((item) => (
          (item.category === "Tutorials" || item.instructor) ? (
            <TutorialCard key={item.id} tutorial={item} />
          ) : (
            <ProductCard key={item.id} product={item} />
          )
        ))}
      </div>

      {!isLoading && products.length === 0 && (
        <p className='empty-product-message'>
          No products found matching "{searchTerm}".
        </p>
      )}
    </div>
  );
};

export default Shop;