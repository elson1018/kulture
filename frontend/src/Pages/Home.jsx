import React from 'react'
import { useNavigate } from 'react-router-dom'
import Instruments from './Instruments'
import '../CSS/Home.css'

const Home = () => {

  const navigate = useNavigate();

  // function to scroll to the categories section
  const scrollToCategories = () => {
    const section = document.getElementById('categories-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <p>Limited Time Offer:</p>
        <h1>10% OFF all traditional instruments!</h1>
        {/*Placeholder for photo*/}
        <button onClick={() => {
          return (navigate('/shop/instruments')
        )}}>Shop Now</button> 
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section id="categories-section" className="featured-categories">
        <h1>Shop By Kulture</h1>
        <div className="category-grid">
          {/*Placeholder for category*/}
        </div>
      </section>

      {/* --- TRENDING SECTION --- */}
      <section className="trending-products">
        <h1>Trending in the Market Place</h1>
        <div className="trending-grid">
          {/*Placeholder for category */}
        </div>
      </section>
    </div>
  )
}

export default Home