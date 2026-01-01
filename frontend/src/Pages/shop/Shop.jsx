import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ENDPOINTS } from '../../config/api';
import ProductCard from '../../components/Product/ProductCard';
import TutorialCard from '../../components/Tutorial/TutorialCard';
import ScrollTopButton from '../../components/ScrollTopButton';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sortBy: 'default'
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('search');

  // Dynamic title based on search
  useDocumentTitle(searchTerm ? `Search: ${searchTerm} | Kulture` : 'Shop | Kulture');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products and tutorials in parallel
        const [productsParam, tutorialsParam] = await Promise.all([
          fetch(ENDPOINTS.PRODUCTS),
          fetch(ENDPOINTS.TUTORIALS)
        ]);

        if (!productsParam.ok || !tutorialsParam.ok) {
          throw new Error(`HTTP ERROR Status: ${productsParam.status || tutorialsParam.status}`);
        }

        const productsData = await productsParam.json();
        const tutorialsData = await tutorialsParam.json();

        // Combine them
        const allData = [...productsData, ...tutorialsData];

        // Store all products
        setProducts(allData);

      } catch (error) {
        console.log("Error fetching " + error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search whenever products or filters change
  useEffect(() => {
    let result = [...products];

    // 1. Apply search filter if there's a search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(lowerTerm) ||
        (item.description && item.description.toLowerCase().includes(lowerTerm))
      );
    }

    // 2. Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(item => {
        // Check if item matches selected categories
        if (filters.categories.includes(item.category)) {
          return true;
        }
        // Special case: Tutorials can be identified by having an instructor property
        if (filters.categories.includes('Tutorials') && item.instructor) {
          return true;
        }
        return false;
      });
    }

    // 3. Apply price filter
    result = result.filter(item => {
      const price = parseFloat(item.price) || 0;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // 4. Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'rating':
        result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(result);
  }, [products, filters, searchTerm]);

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

  // Filter change handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      sortBy: 'default'
    });
  };

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

      <div className="shop-content">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          <div className="products-count">
            <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</p>
          </div>

          <div className="product-grid">
            {filteredProducts.map((item) => (
              (item.category === "Tutorials" || item.instructor) ? (
                <TutorialCard key={item.id} tutorial={item} />
              ) : (
                <ProductCard key={item.id} product={item} />
              )
            ))}
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <p className='empty-product-message'>
              {searchTerm
                ? `No products found matching "${searchTerm}".`
                : "No products match your filters. Try adjusting your criteria."
              }
            </p>
          )}
        </main>
      </div>

      <ScrollTopButton />
    </div>
  );
};

export default Shop;