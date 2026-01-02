import React, { useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import Popup from '../../components/Popup/Popup';
import './Contact.css';

const Contact = () => {
  useDocumentTitle('Contact Us | Kulture');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupMessage("Your message has been sent successfully!");
    setPopupType("success");
    setIsPopupOpen(true);
    e.target.reset();
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className='contact-page'>
      <header className="contact-header">
        <h1>Connect With Kulture</h1>
        <p>We're here to help! Whether you have questions about an artisan, an order, or a partnership, please reach out to our team.</p>
      </header>

      <main className="contact-content-wrapper">
        <section className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Subject(e.g., Order Inquiry, Partnership)" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </section>
        <aside className="contact-info-section">
          <h2>Find Our Hub</h2>
          <div className="info-details">
            <p><strong>Email: </strong>kulture05@gmail.com</p>
            <p><strong>Phone: </strong>+60 11 5503 7268</p>
            <p><strong>Address: </strong>77A Batu 12 1/2 Jalan Kaki Bukit, 02200 Kaki Bukit, Perlis </p>
          </div>
        </aside>
      </main>
      <Popup
        isOpen={isPopupOpen}
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
      />
    </div>
  );
};

export default Contact;