import React, { useState, useEffect } from 'react';
import ProductCard from '../components/Product/ProductCard';
import '../CSS/Instruments.css'; // Re-using the style from Instruments as requested

const Food = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products');

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
            <div className='shop-page' style={{ paddingTop: '100px' }}>
                <h2 style={{ textAlign: 'center' }}>Loading Delicious Eats...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className='shop-page' style={{ paddingTop: '100px' }}>
                <h2 style={{ textAlign: 'center', color: 'red' }}>Error: {error}</h2>
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
                <p id='empty-product-message' style={{ textAlign: 'center', marginTop: '40px' }}>
                    No food items found.
                </p>
            )}
        </div>
    );
};

export default Food;