import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext'; 
import '../CSS/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // this forces the browser to scroll to top when opening a new product
    window.scrollTo(0, 0);

    fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products')
      .then(res => res.json())
      .then(data => {
        // then look for the product that matches the id
        const foundProduct = data.find(p => String(p.id) === String(id));

        if (foundProduct) {
        setProduct(foundProduct);
        
        const imagesSource = foundProduct.images || foundProduct.image;

        const rawImage = Array.isArray(imagesSource) && imagesSource.length > 0
        ? imagesSource[0]
        : "/products/placeholder.jpg";

          setSelectedImage(rawImage);
        }
       
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading product", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="product-detail-page loading"><h2>Loading Product Details...</h2></div>;
  }

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

          <p className="detail-description">{product.description}</p>

          <div className="action-buttons">
            <button 
              className="add-cart-btn" 
              onClick={() => {
                addToCart(product.id);
                alert(`${product.name} added to cart!`);
              }}
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