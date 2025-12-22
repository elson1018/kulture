import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import '../CSS/Home.css'

const Home = () => {

  const navigate = useNavigate();

  const [trendingProducts, setTrendingProducts] = useState([]);

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) { // the button will be displayed after scrolling down 300px
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products') // fetch products from backedn
      .then(res => res.json())
      .then(data => {
        
        // this takes 4 random products from backend
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        setTrendingProducts(selected);
      })
      .catch(err => console.error("Error fetching trending:", err));
  }, []);

  // function to scroll to the categories section
  const scrollToCategories = () => {
    const section = document.getElementById('categories-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { title: 'Traditional Food', path: '/shop/food', image: '/products/Food/Murukku.png', desc: 'Taste the heritage' },
    { title: 'Souvenirs', path: '/shop/souvenirs', image: '/products/Souvenirs/Congkak.jpg', desc: 'Handcrafted memories' },
    { title: 'Instruments', path: '/shop/instruments', image: '/products/Instruments/Erhu_main.jpg', desc: 'Sounds of culture' },
    { title: 'Tutorials', path: '/shop/tutorial', image: '/products/Tutorials/Fan_dance.jpeg', desc: 'Learn the dance' },
  ];

  return (
    <div className='home-page'>
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="content">
          <h1>Discover the Soul of Heritage</h1>
          <p>Immerse yourself in the rich traditions of Malaysia. Shop authentic instruments, handcrafted souvenirs, and traditional delicacies.</p>
          <button className='primary-button' onClick={scrollToCategories}>Explore Now</button>
          <button className='secondary-button' onClick={() => {
            return (navigate('/shop')
          )}}>Start Your Journey</button>
        </div>
      </section>
        
      {/* --- PROMOTION SECTION --- */}
      <section className="promotion">
        <div className="promotion-content">
          <p>Limited Time Offer:</p>
          <h1>10% OFF all traditional instruments!</h1>
          <button onClick={() => {
            return (navigate('/shop/instruments')
          )}}>Shop Now</button>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section id="categories-section" className="featured-categories">
        <h1>Shop By Kulture</h1>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card" onClick={() => navigate(cat.path)}>
              <div className="cat-image-container">
                <img src={cat.image} alt={cat.title} />
              </div>
              <div className="cat-info">
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* --- TRENDING SECTION --- */}
      <section className="trending-products">
        <h1>Trending in the Market Place</h1>
        <div className="trending-grid">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((item) => (
              <div key={item.id} className="trending-card" onClick={() => navigate(`/product/${item.id}`)}>
                <div className="trend-image">
                  <img 
                    src={item.images && item.images.length > 0 ? item.images[0] : item.image || '/products/placeholder.jpg'} 
                    alt={item.name} 
                  />
                  <span className="badge">Hot</span>
                </div>
                <div className="trend-info">
                  <h3>{item.name}</h3>
                  <p className="trend-cat">{item.category}</p>
                  <p className="trend-price">RM {item.price.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center', width: '100%'}}>Loading trending items...</p>
          )}
        </div>
      </section>

      {/* I added scroll to top button here */}
      {showScrollBtn && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  )
}

export default Home