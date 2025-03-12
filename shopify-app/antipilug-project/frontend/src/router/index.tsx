import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Auth Pages
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';

// Main Pages
import Home from '../pages/Home';
import Videos from '../pages/Videos';
import Shop from '../pages/Shop';
import Profile from '../pages/Profile';
import HelpCenter from '../pages/HelpCenter';
import About from '../pages/About';
import Matchmaking from '../pages/Matchmaking';
import SearchResults from '../pages/SearchResults';
import Research from '../pages/Research';
import VideoPage from '../pages/VideoPage';

// Games and Interactive
import BuildCity from '../pages/BuildCity';
import FlappyBirdGame from '../pages/FlappyBirdGame';

// Questionnaires
import PoliticalQuestionnaire from '../pages/Questionnaire/PoliticalQuestionnaire';
import HobbiesQuestionnaire from '../pages/Questionnaire/HobbiesQuestionnaire';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes - No Navbar */}
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Main Routes - With Navbar */}
      <Route element={<MainLayout />}>
        {/* All routes public for now */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/research" element={<Research />} />
        
        {/* Games */}
        <Route path="/build-city" element={<BuildCity />} />
        <Route path="/flappy-bird-game" element={<FlappyBirdGame />} />
        
        {/* Questionnaires */}
        <Route path="/questionnaire">
          <Route index element={<Navigate to="/questionnaire/political" replace />} />
          <Route path="political" element={<PoliticalQuestionnaire />} />
          <Route path="hobbies" element={<HobbiesQuestionnaire />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default Router;
