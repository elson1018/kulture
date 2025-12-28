import React, { useState, useEffect } from 'react';
import './ScrollTopButton.css';

const ScrollTopButton = () => {
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
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

    if (!showScrollBtn) {
        return null;
    }

    return (
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
            ↑
        </button>
    );
};

export default ScrollTopButton;
