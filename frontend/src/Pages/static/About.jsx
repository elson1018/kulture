import React from 'react';
import { useNavigate } from 'react-router-dom';
import missionIcon from '../../assets/mission.png';
import visionIcon from '../../assets/vision.png';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const offerings = [
    {
      title: 'Traditional Food',
      description: 'Authentic Malaysian delicacies crafted using traditional recipes and methods',
      path: '/shop/food'
    },
    {
      title: 'Handcrafted Souvenirs',
      description: 'Unique, artisan-made souvenirs that capture Malaysia\'s cultural essence',
      path: '/shop/souvenirs'
    },
    {
      title: 'Musical Instruments',
      description: 'Traditional instruments handcrafted by skilled makers, preserving musical heritage',
      path: '/shop/instruments'
    },
    {
      title: 'Cultural Tutorials',
      description: 'Learn traditional dances, crafts, and practices from cultural experts',
      path: '/shop/tutorial'
    }
  ];

  const values = [
    {
      title: 'Authenticity',
      points: [
        'Every product is sourced directly from skilled artisans',
        'No mass-produced imitations—only genuine cultural treasures'
      ]
    },
    {
      title: 'Cultural Preservation',
      points: [
        'Supporting traditional craftspeople and their families',
        'Keeping cultural knowledge alive for future generations'
      ]
    },
    {
      title: 'Quality & Trust',
      points: [
        'Rigorous quality standards for every item',
        'Transparent sourcing and fair partnerships with artisans'
      ]
    }
  ];

  const stats = [
    { number: '100+', label: 'Products' },
    { number: '20+', label: 'Artisans Supported' },
    { number: '1000+', label: 'Happy Customers' },
    { number: '100%', label: 'Authentic Products' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Preserving Heritage, One Product at a Time</h1>
          <p>Kulture is your gateway to authentic Malaysian traditions, connecting artisans with culture enthusiasts worldwide.</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story">
        <div className="story-content">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              In a world of mass production, Kulture stands as a beacon for authentic Malaysian heritage.
              Founded in 2024, we recognized that traditional crafts, instruments, and cultural practices
              were slowly fading from daily life.
            </p>
            <p>
              Our mission is simple: preserve and celebrate Malaysia's rich cultural tapestry by connecting
              passionate artisans directly with people who value authenticity and tradition.
            </p>
            <p>
              Every product on Kulture tells a story—of skilled craftspeople, time-honored techniques,
              and the vibrant cultures that make Malaysia unique.
            </p>
          </div>
          <div className="story-image">
            <div className="story-image-placeholder">
              {/* i plan to add an image here */}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission-vision">
        <div className="mission-vision-container">
          <div className="mission-card">
            <div className="card-icon">
              <img src={missionIcon} alt="Mission" className="icon-image" />
            </div>
            <h3>Our Mission</h3>
            <p>
              To preserve Malaysian cultural heritage by providing a trusted marketplace for authentic
              traditional products and educational resources, supporting local artisans and culture bearers.
            </p>
          </div>
          <div className="vision-card">
            <div className="card-icon">
              <img src={visionIcon} alt="Vision" className="icon-image" />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become the leading platform where Malaysian culture thrives, inspiring future generations
              to embrace and continue their cultural legacy.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="about-offerings">
        <h2>What We Offer</h2>
        <div className="offerings-grid">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className="offering-card"
              onClick={() => navigate(offering.path)}
            >
              <h3>{offering.title}</h3>
              <p>{offering.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values Section */}
      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <h3>{value.title}</h3>
              <ul>
                {value.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="about-stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team CTA */}
      <section className="about-team-cta">
        <h2>Meet the People Behind Kulture</h2>
        <p>Our passionate team works tirelessly to connect you with authentic cultural treasures.</p>
        <button className="team-cta-button" onClick={() => navigate('/team')}>
          Meet Our Team
        </button>
      </section>

      {/* Final CTA Section */}
      <section className="about-final-cta">
        <h2>Start Your Cultural Journey Today</h2>
        <p>Explore our curated collection of authentic Malaysian products</p>
        <div className="cta-buttons">
          <button className="primary-cta" onClick={() => navigate('/shop')}>
            Browse Shop
          </button>
          <button className="primary-cta" onClick={() => navigate('/contact')}>
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
