import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import '../CSS/Food.css'; // Make sure this imports Food.css, not Souvenirs.css
import ProductCard from '../components/Product/ProductCard';
const Food = () => {
    const [foodProducts, setFoodProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [quantities, setQuantities] = useState({});
    const { addToCart } = useContext(ShopContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                // Filter only Food category
                const foodItems = data.filter(item => item.category === 'Food');

                setFoodProducts(foodItems);
                setLoading(false);
            } catch (error) {
                console.error("Error loading products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleQuantityChange = (id, value) => {
        const qty = Math.max(1, parseInt(value) || 1);
        // FIX 1: Fixed spelling of setQuantities (was setQUantities)
        setQuantities(prev => ({ ...prev, [id]: qty }));
    };

    // FIX 2: Fixed spelling of loading (was loadng)
    if (loading) return <div className='shop-page'><h2 style={{ textAlign: 'center' }}>Loading Delicious Eats...</h2></div>;

    return (
        <div className='shop-page'>
            <div className="shop-header">
                <h1>Traditional Delicacies</h1>
                <p>Taste the authentic flavors of Malaysia, delivered to your doorstep.</p>
            </div>

            <div className="product-grid">
                {foodProducts.map((product) => {
                    const imageList = product.images || product.image || [];
                    const mainImage = imageList.length > 0 ? imageList[0] : "/products/placeholder.jpg";
                    const currentQty = quantities[product.id] || 1;

                    return (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    onError={(e) => { e.target.src = "/products/placeholder.jpg" }}
                                />
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">RM {product.price.toFixed(2)}</p>

                                <div className="product-details">
                                    <span className="product-rating">⭐ {product.rating || "N/A"}</span>
                                    <p className="product-desc">{product.description}</p>
                                </div>

                                {/* FIX 3: Used clean CSS classes from Food.css instead of inline styles */}
                                <div className="quantity-selector">
                                    <span className="quantity-label">Qty:</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(product.id, currentQty - 1)}
                                    >
                                        -
                                    </button>

                                    <input
                                        className="quantity-input"
                                        type="number"
                                        value={currentQty}
                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                    />

                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(product.id, currentQty + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="add-to-cart-btn primary-button"
                                    onClick={() => addToCart(product.id, currentQty)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Food;