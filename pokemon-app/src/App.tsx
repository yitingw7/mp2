import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import './App.css';

const App: React.FC = () => {
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname === 'yitingw7.github.io';
    const basename = isGitHubPages ? '/mp2' : '';

    return (
        <Router basename={basename}>
            <div className="App">
                <nav className="navbar">
                    <div className="nav-container">
                        <Link to="/" className="nav-logo">
                            <h1>Pokemon Explorer</h1>
                        </Link>
                        <div className="nav-menu">
                            <Link to="/" className="nav-link">List View</Link>
                            <Link to="/gallery" className="nav-link">Gallery View</Link>
                        </div>
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<ListView />} />
                        <Route path="/gallery" element={<GalleryView />} />
                        <Route path="/pokemon/:id" element={<DetailView />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
