import React, { useState, useEffect } from 'react';
import '../CSS/Tutorial.css';

const API_BASE_URL = 'http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api';

const Tutorial = ({ user }) => {
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [previewTutorial, setPreviewTutorial] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
    const [isBooking, setIsBooking] = useState(false);

    const getUserEmail = () => {
        if (user?.email) return user.email;
        const storedUser = JSON.parse(localStorage.getItem('user'));
        return storedUser?.email || null;
    };

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/tutorials`);
                if (!response.ok) throw new Error('Failed to fetch tutorials');
                const data = await response.json();
                setTutorials(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTutorials();
    }, []);

    const handleBookOrBuyClick = (tutorial) => {
        if (!getUserEmail()) {
            alert('Please log in to book or purchase tutorials.');
            return;
        }
        setSelectedTutorial(tutorial);
        setShowBookingModal(true);
        if (tutorial.isLiveClass) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow.toISOString().split('T')[0]);
            setSelectedTime('10:00');
        }
    };

    const handleBookingConfirm = async () => {
        const email = getUserEmail();
        setIsBooking(true);
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tutorialId: selectedTutorial.id,
                    userEmail: email,
                    scheduledDate: selectedTutorial.isLiveClass ? `${selectedDate}T${selectedTime}` : null,
                    status: selectedTutorial.isLiveClass ? 'Upcoming' : 'Purchased'
                }),
            });

            if (response.ok) {
                setBookingMessage({ type: 'success', text: 'Success! View your classes in Settings.' });
                setTimeout(() => setShowBookingModal(false), 2000);
            } else {
                throw new Error('Booking failed');
            }
        } catch (err) {
            setBookingMessage({ type: 'error', text: err.message });
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return <div className='tutorial-page'><h1>Loading Tutorials...</h1></div>;

    return (
        <div className="tutorial-page">
            <h1>Tutorials & Classes</h1>
            <p className="page-subtext">Book a live session or access recorded dance lessons.</p>

            <div className="tutorial-grid">
                {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="tutorial-card">
                        <img src={tutorial.images?.[0] || "/products/Tutorials/default.jpeg"} alt={tutorial.name} />
                        <div className="card-content">
                            <h2>{tutorial.name}</h2>
                            <p className="instructor-name">By {tutorial.instructor}</p>
                            <p className="tutorial-price">RM{tutorial.price.toFixed(2)}</p>
                            <div className="tutorial-actions">
                                <button onClick={() => { setPreviewTutorial(tutorial); setShowPreview(true); }}>Watch Preview</button>
                                <button className="book-btn" onClick={() => handleBookOrBuyClick(tutorial)}>
                                    {tutorial.isLiveClass ? "Book Class" : "Buy Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Confirm {selectedTutorial.isLiveClass ? 'Booking' : 'Purchase'}</h2>
                        <p>{selectedTutorial.name} with {selectedTutorial.instructor}</p>
                        {selectedTutorial.isLiveClass && (
                            <div className="datetime-fields">
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                                <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
                            </div>
                        )}
                        <p className={`message ${bookingMessage.type}`}>{bookingMessage.text}</p>
                        <button onClick={handleBookingConfirm} disabled={isBooking}>
                            {isBooking ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tutorial;