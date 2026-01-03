import React from "react";
import "./Popup.css";

const Popup = ({ isOpen, message, type, onClose, onConfirm, confirmText = "Confirm" }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className={`popup-content ${type}`}>
                <div className="popup-icon">
                    {type === "success" ? (
                        <span className="tick-icon">✔</span>
                    ) : type === "error" ? (
                        <span className="cross-icon">✖</span>
                    ) : (
                        <span className="warning-icon">!</span>
                    )}
                </div>
                <h3>{type === "success" ? "Success!" : type === "error" ? "Error" : "Notification"}</h3>
                <p>{message}</p>

                {onConfirm ? (
                    <div className="popup-actions">
                        <button onClick={onClose} className="popup-button cancel">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="popup-button confirm">
                            {confirmText}
                        </button>
                    </div>
                ) : (
                    <button onClick={onClose} className="popup-button">
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default Popup;