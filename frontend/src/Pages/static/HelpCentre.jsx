import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpCentre.css";

const faqs = [
  // Can put questions here
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How do I track my order?",
        a: "Once your order ships, you can view the order status in 'My Orders'.",
      },
      {
        q: "How long does delivery take?",
        a: "Local Malaysian orders take 3-5 business days. International orders typically take 7-14 business days.",
      },
    ],
  },

  {
    category: "Products & Artisans",
    questions: [
      {
        q: "Are these products authentic?",
        a: "Absolutely. We work directly with local artisans to ensure every item is 100% authentic and handcrafted.",
      },
      {
        q: "Can I contact the artisan directly?",
        a: "Currently, you can send messages to our team via the 'Contact Us' button.",
      },
    ],
  },
];

const HelpCentre = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleFAQ = (uniqueKey) => {
    setOpenIndex(openIndex === uniqueKey ? null : uniqueKey);
  };

  const filteredFAQs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>How can we help you?</h1>
        <input
          type="text"
          placeholder="Search for answers (e.g. 'return', 'shipping')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="help-search"
        />
      </div>

      <div className="faq-container">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2>{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((item, qIndex) => {
                  const uniqueKey = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === uniqueKey;

                  return (
                    <div
                      key={qIndex}
                      className={`faq-item ${isOpen ? "open" : ""}`}
                      onClick={() => toggleFAQ(uniqueKey)}
                    >
                      <div className="faq-question">
                        <span>{item.q}</span>
                        <span className="faq-icon">{isOpen ? "-" : "+"}</span>
                      </div>
                      {isOpen && <div className="faq-answer">{item.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No results found for "{searchTerm}"</h3>
            <p>Try searching for something else or contact us below.</p>
          </div>
        )}
      </div>

      <div className="contact-support-banner">
        <h3>Still cannot find what you are looking for?</h3>
        <button onClick={() => navigate("/contact")}>Contact Us Here!</button>
      </div>
    </div>
  );
};

export default HelpCentre;
