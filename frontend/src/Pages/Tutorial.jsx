import React, { useState, useEffect } from 'react';
import '../CSS/Tutorial.css';
import TutorialCard from '../components/Tutorial/TutorialCard';

const API_BASE_URL = 'http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api';

const Tutorial = () => {
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (isLoading) return <div className='tutorial-page'><h1>Loading Tutorials...</h1></div>;

    return (
        <div className="tutorial-page">
            <div className="tutorial-header">
                <h1>Tutorials & Classes</h1>
                <p className="page-subtext">Book a live session or access recorded dance lessons.</p>
            </div>

            <div className="tutorial-grid">
                {tutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))}
            </div>
        </div>
    );
};

export default Tutorial;