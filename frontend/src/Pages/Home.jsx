import React from 'react'
import { useNavigate } from 'react-router-dom'
import Instruments from './Instruments'
import '../CSS/Home.css'

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className='home-page'>
      <section className="hero-section">
        <div className="content">
          <h1>Discover the Soul of Heritage</h1>
          <p>Placeholder for the paragraph</p>
          <button className='primary-button'>Explore Now</button>
          <button className='secondary-button' onClick={() => {
            return (navigate('/shop')
          )}}>Start Your Journey</button>
        </div>
      </section>

      <section className="promotion">
        <p>Limited Time Offer:</p>
        <h1>10% OFF all traditional instruments!</h1>
        {/*Placeholder for photo*/}
        <button onClick={() => {
          return (navigate('/shop/instruments')
        )}}>Shop Now</button> 
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