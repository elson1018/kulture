import React, { useState, useEffect } from 'react';
import '../CSS/Tutorial.css';

const API_BASE_URL = 'http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api';

const Tutorial = ({ user }) => {
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewTutorial, setPreviewTutorial] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tutorials`)
            .then(res => res.json())
            .then(data => {
                setTutorials(data);
                setIsLoading(false);
            });
    }, []);

    const handleBookOrBuy = (tutorial) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) return alert("Please login first");

        setSelectedTutorial(tutorial);
        setShowBookingModal(true);
    };

    if (isLoading) return <div className="tutorial-page"><h1>Loading...</h1></div>;

    return (
        <div className="tutorial-page">
            <h1>Tutorials & Classes</h1>
            <div className="tutorial-grid">
                {tutorials.map((t) => (
                    <div key={t.id} className="tutorial-card">
                        <div className="card-content">
                            <h2>{t.name}</h2>
                            <p>Instructor: {t.instructor}</p>
                            <p>Price: RM{t.price.toFixed(2)}</p>
                            <div className="tutorial-actions">
                                <button onClick={() => { setPreviewTutorial(t); setShowPreview(true); }}>Watch Preview</button>
                                <button className="book-btn" onClick={() => handleBookOrBuy(t)}>
                                    {t.isLiveClass ? "Book Class" : "Buy Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Preview Modal */}
            {showPreview && previewTutorial && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowPreview(false)}>×</button>
                        <h2>{previewTutorial.name} - Preview</h2>
                        <video width="100%" controls autoPlay src={previewTutorial.images[0]} />
                        <p>{previewTutorial.description}</p>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedTutorial && (
                <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Confirm Purchase</h2>
                        {selectedTutorial.isLiveClass && (
                            <div>
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                                <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
                            </div>
                        )}
                        <button onClick={() => setShowBookingModal(false)}>Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tutorial;