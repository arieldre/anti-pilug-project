import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Videos from '../pages/Videos';
import Shop from '../pages/Shop'; // Import Shop page
import Profile from '../pages/Profile';
import HelpCenter from '../pages/HelpCenter';
import About from '../pages/About';
import Matchmaking from '../pages/Matchmaking';
import SearchResults from '../pages/SearchResults';
import Research from '../pages/Research';
import BuildCity from '../pages/BuildCity';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/shop" element={<Shop />} /> {/* Replace Courses with Shop */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/about" element={<About />} />
      <Route path="/matchmaking" element={<Matchmaking />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/research" element={<Research />} />
      <Route path="/build-city" element={<BuildCity />} />
    </Routes>
  );
};

export default Router;