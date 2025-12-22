import React from "react";
import "./Popup.css";

const Popup = ({ isOpen, message, type, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className={`popup-content ${type}`}>
                <div className="popup-icon">
                    {type === "success" ? (
                        <span className="tick-icon">✔</span>
                    ) : (
                        <span className="cross-icon">✖</span>
                    )}
                </div>
                <h3>{type === "success" ? "Success!" : "Notification"}</h3>
                <p>{message}</p>
                <button onClick={onClose} className="popup-button">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Popup;