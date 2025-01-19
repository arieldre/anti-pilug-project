import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Videos from '../pages/Videos';
import Courses from '../pages/Courses';
import Profile from '../pages/Profile';
import HelpCenter from '../pages/HelpCenter';
import About from '../pages/About';
import Matchmaking from '../pages/Matchmaking';
import SearchResults from '../pages/SearchResults';
import Research from '../pages/Research';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/about" element={<About />} />
      <Route path="/matchmaking" element={<Matchmaking />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/research" element={<Research />} />
    </Routes>
  );
};

export default Router;