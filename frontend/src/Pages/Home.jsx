import React from 'react'
import '../CSS/Home.css'

const Home = () => {
  return (
    <div className='home-page'>
      <section className="hero-section">
        <div className="content">
          <h1>Discover the Soul of Heritage</h1>
          
          <button className='primary-button'>Explore Now</button>
          <button className='secondary-button'>Start Your Journey</button>
        </div>
      </section>

      <section className="promotion">
        <p>Limited Time Offer:</p>
        <h1>10% OFF all traditional instruments!</h1>
        {/*Placeholder for photo*/}
        <button>Shop Now</button> 
      </section>

      <section className="featured-categories">
        <h1>Shop By Kulture</h1>
        <div className="category-grid">
          {/*Placeholder for category*/}
        </div>
      </section>

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