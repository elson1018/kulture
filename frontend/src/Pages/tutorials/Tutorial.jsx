import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ENDPOINTS } from '../../config/api';
import './Tutorial.css';
import TutorialCard from '../../components/Tutorial/TutorialCard';
import ScrollTopButton from '../../components/ScrollTopButton';

const Tutorial = () => {
    useDocumentTitle('Tutorials & Classes | Kulture');
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await fetch(ENDPOINTS.TUTORIALS);
                if (!response.ok) throw new Error('Failed to fetch tutorials');
                const data = await response.json();
                setTutorials(data);
            } catch (err) {
                console.error(err.message);
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
            <ScrollTopButton />
        </div>
    );
};

export default Tutorial;