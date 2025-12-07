import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';

import '../CSS/Instruments.css';
import ProductCard from '../components/Product/ProductCard';


const handleAddProduct = (productID) => {
  console.log( "Added product with ID: " + productID);
}


const Instruments = () => {

  const [products , setProduct] = useState([]);
  const [isLoading , setLoading] = useState(true);
  const [error , setError]  = useState(null);

  useEffect (() => {
    const fetchProducts = async () => {
      try {
        //Setloading and clear the errors
        setLoading(true);
        setError(null);

        const response = await fetch ("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products");

        if(!response.ok){
            throw new Error( ` HTTP ERROR Status: ${response.status} ` );
        }

        const productData = await response.json();//Parse the json data into product
        const instrumentData = (productData).filter(items => items.category === "Instruments");
        //Set the product data
        setProduct(instrumentData);

      }catch(error){
        console.log ( "Error fetching " + error.message);
        setError(error.message);
      }finally{

        setLoading(false);

      }

    }

    fetchProducts();
  }, []);

 if (isLoading) {
        return <div className='shop-page'><h2 style={{textAlign: 'center'}}>Loading Instruments...</h2></div>;
    }

    if (error) {
         return <div className='shop-page'><h2 style={{textAlign: 'center', color: 'red'}}>Error: {error}</h2></div>;
    }
    
    // ⬇️ 2. REPLACE <ProductCard> WITH MANUAL JSX MAPPING ⬇️
    return (
        <div className='shop-page'>
            <div className="shop-header">
                <h1>Instruments Marketplace</h1>
                <p>Discover traditional and modern musical instruments.</p>
            </div>
            
            <div className="product-grid">
                {products.map((product) => {
                    // 3. ADD ROBUST IMAGE LOGIC (from Souvenirs.jsx)
                    const imageList = product.images || []; // Ensure 'images' field exists and is an array
                    const mainImage = imageList.length > 0 ? imageList[0] : "/products/placeholder.jpg";

                    return (
                        // Copy the manual structure used in Souvenirs.jsx
                        <div key={product._id || product.id} className="product-card"> 
                            <div className="product-image-container">
                                <img 
                                    src={mainImage} 
                                    alt={product.name}
                                    // Add the onError handler for image fallback
                                    onError={(e) => {e.target.src = "/products/placeholder.jpg"}} 
                                /> 
                            </div>
                            
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                {/* Use toFixed(2) for price consistency */}
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
            
            {!isLoading && products.length === 0 && (
                 <p id='empty-product-message'>No products found in this category.</p>
            )}
        </div>
    );
};
export default Instruments;

