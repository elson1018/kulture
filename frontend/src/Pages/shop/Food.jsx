import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ENDPOINTS } from '../../config/api';
import ProductCard from '../../components/Product/ProductCard';
import './Instruments.css'; // Re-using the style from Instruments as requested

const Food = () => {
    useDocumentTitle('Traditional Food | Kulture');
    const [products, setProducts] = useState([]);
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

                const data = await response.json();

                // Filter only Food category
                const foodItems = data.filter(item => item.category === 'Food');

                setProducts(foodItems);
            } catch (error) {
                console.error("Error loading products:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className='shop-page loading-state'>
                <h2>Loading Delicious Eats...</h2>
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
                <h1>Traditional Delicacies</h1>
                <p>Taste the authentic flavors of Malaysia, delivered to your doorstep.</p>
            </div>

            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {!isLoading && products.length === 0 && (
                <p className='empty-product-message'>
                    No food items found.
                </p>
            )}
        </div>
    );
};

export default Food;