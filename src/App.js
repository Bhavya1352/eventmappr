import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import FooterSection from './components/sections/FooterSection';
import HomePage from '@/pages/HomePage';
import TouristPlacesPage from '@/pages/tourist-places';



// Import CSS
import './styles/style.css';
import './styles/Home.css';
import './styles/AppStyles.css';
import './styles/faq.css';
import 'leaflet/dist/leaflet.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tourist-places" element={<TouristPlacesPage />} />
          </Routes>
        </main>
        <FooterSection />
      </div>
    </Router>
  );
};

export default App;