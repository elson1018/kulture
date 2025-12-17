import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../CSS/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
            try {
                setLoading(true);
                //fetch all products with the matching id
                const response = await fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products");
                
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                
                //Find the specific product that matches the id
                
                const foundProduct = data.find(p => String(p.id) === id);

                if (foundProduct) {
                    setProduct(foundProduct);
                    // Set the first image as the default main image
                    if (foundProduct.images && foundProduct.images.length > 0) {
                        setSelectedImage(foundProduct.images[0]);
                    }
                } else {
                    setError("Product not found");
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
  }, [id]);

 const handleAddToCart = async () => {
        // Optional: Check if user is logged in via localStorage before even trying
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Please log in to add items to cart.");
            navigate('/login');
            return;
        }

        const cartItem = {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            images: product.images || []
        };

        try {
            const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 🚨 CRITICAL: Sends Session Cookie
                body: JSON.stringify(cartItem)
            });

            if (response.status === 401) {
                alert("Session expired. Please log in again.");
                navigate('/login');
                return;
            }

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                alert(`Added ${quantity} x ${product.name} to cart!`);
            } else {
                alert("Failed: " + result.message);
            }

        } catch (error) {
            console.error("Cart Error:", error);
            alert("Server connection failed.");
        }
   };

   
  if (loading) {
    return <div className="product-detail-page loading"><h2>Loading Product Details...</h2></div>;
  }
  if (error) return <div className="error-container">{error}</div>;//This can return other 
  if (!product) {
    return (
      <div className="product-detail-page error">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        
        <div className="detail-images">
          <div className="main-image-container">
            <img 
                src={selectedImage} 
                alt={product.name} 
                onError={(e) => {e.target.src = "/products/placeholder.jpg"}}
            />
          </div>
          
          {/*show thumbnails if got multiple images*/}
          {Array.isArray(product.image) && product.image.length > 1 && (
            <div className="thumbnail-list">
              {product.image.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`${product.name} ${index}`}
                  className={selectedImage === img ? 'active-thumb' : ''}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-category">{product.category || "General"}</p>
          <h1>{product.name}</h1>
          
          <div className="detail-rating">
             <span>{product.rating || "New"} ⭐</span>
             <span className="review-count">(Based on user reviews)</span>
          </div>

          <h2 className="detail-price">RM {product.price.toFixed(2)}</h2>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="action-buttons">
            <div className="quantity-wrapper">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button 
              className="add-cart-btn" 
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={() => navigate('/checkout')}>
               Go to Checkout
            </button>
          </div>
          
          <div className="detail-extras">
             <p>Authentic Local Product</p>
             <p>Delivery within 3-5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;