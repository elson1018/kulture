import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import { ENDPOINTS } from "../../config/api";
import ScrollTopButton from "../../components/ScrollTopButton";
import "./ProductDetail.css";
import Popup from "../../components/Popup/Popup";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCartBackend } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "" });

  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const fetchProduct = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      //fetch all products with the matching id
      const response = await fetch(ENDPOINTS.PRODUCTS);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      //Find the specific product that matches the id

      const foundProduct = data.find((p) => String(p.id) === id);

      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.images && foundProduct.images.length > 0) {
          // Preserve existing selection if it exists, otherwise set default
          setSelectedImage(prev => prev || foundProduct.images[0]);
        }

        // Get related products from the same category
        const related = data
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedImage(null);
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) return;

        const payload = { action: 'check', email: user.email, productId: id };

        const response = await fetch(ENDPOINTS.REVIEWS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          setCanReview(data.canReview);
        } else {
          console.error("Eligibility check failed:", response.status);
        }
      } catch (e) {
        console.error("Failed to check review eligibility", e);
      }
    };

    if (id) checkEligibility();
  }, [id]);

  const handleAddToCart = async () => {
    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      images: product.images || [],

    };

    // addToCartBackend from ShopContext
    const result = await addToCartBackend(cartItem);

    if (result.success) {
      setPopup({ isOpen: true, message: result.message, type: "success" });
    } else {
      setPopup({ isOpen: true, message: result.message, type: "error" });
      if (result.type === "auth") {
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };

  const handleBuyNow = async () => {
    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      images: product.images || [],
    };

    const result = await addToCartBackend(cartItem);

    if (result.success) {
      navigate("/checkout");
    } else {
      setPopup({ isOpen: true, message: result.message, type: "error" });
      if (result.type === "auth") {
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page loading">
        <h2>Loading Product Details...</h2>
      </div>
    );
  }
  if (error) return <div className="error-container">{error}</div>; //This can return other
  if (!product) {
    return (
      <div className="product-detail-page error">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/shop")}>Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
      <div className="detail-container">
        <button className="back-btn" onClick={handleBack}>
          X CLOSE
        </button>
        <div className="detail-images">
          <div className="main-image-container">
            <img
              src={selectedImage}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/products/placeholder.jpg";
              }}
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
                  className={selectedImage === img ? "active-thumb" : ""}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-category">{product.category || "General"}</p>
          <h1>{product.name}</h1>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-rating">
            <span>{product.rating || "New"} ⭐</span>
            <span className="review-count">(Based on user reviews)</span>
          </div>

          <h2 className="detail-price">RM {product.price.toFixed(2)}</h2>





          <div className="detail-extras">
            <p>Authentic Local Product</p>
            <p>Delivery within 3-5 days</p>
          </div>



        </div>
        <div className="action-buttons">
          <div className="quantity-wrapper">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button
            className="buy-now-btn"
            onClick={handleBuyNow}
          >
            Go to Checkout
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/product/${item.id}`);
                }}
              >
                <div className="related-image">
                  <img
                    src={item.images?.[0] || '/products/placeholder.jpg'}
                    alt={item.name}
                    onError={(e) => { e.target.src = '/products/placeholder.jpg' }}
                  />
                </div>
                <div className="related-info">
                  <p className="related-name">{item.name}</p>
                  <p className="related-price">RM {item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="review-section">
        <ReviewList reviews={product.reviews || []} />

        {canReview && (
          <div className="review-action-container">
            {!showReviewForm ? (
              <button className="write-review-btn" onClick={() => setShowReviewForm(true)}>
                Write a Review
              </button>
            ) : (
              <div className="review-form-wrapper">
                <button className="cancel-review-btn" onClick={() => setShowReviewForm(false)}>Cancel</button>
                <ReviewForm productId={product.id} onReviewSubmitted={() => fetchProduct(true)} />
              </div>
            )}
          </div>
        )}
      </div>

      <ScrollTopButton />

    </div>
  );
};

export default ProductDetail;
