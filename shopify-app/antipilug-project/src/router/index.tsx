import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Videos from '../pages/Videos';
import Shop from '../pages/Shop';
import Profile from '../pages/Profile';
import HelpCenter from '../pages/HelpCenter';
import About from '../pages/About';
import Matchmaking from '../pages/Matchmaking';
import SearchResults from '../pages/SearchResults';
import Research from '../pages/Research';
import BuildCity from '../pages/BuildCity';
import FlappyBirdGame from '../pages/FlappyBirdGame';
import VideoPage from '../pages/VideoPage';
import PoliticalQuestionnaire from '../pages/Questionnaire/PoliticalQuestionnaire';
import HobbiesQuestionnaire from '../pages/Questionnaire/HobbiesQuestionnaire';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/about" element={<About />} />
      <Route path="/matchmaking" element={<Matchmaking />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/research" element={<Research />} />
      <Route path="/video/:id" element={<VideoPage />} />
      <Route path="/build-city" element={<BuildCity />} />
      <Route path="/flappy-bird-game" element={<FlappyBirdGame />} />
      <Route path="/political-questionnaire" element={<PoliticalQuestionnaire />} />
      <Route path="/hobbies-questionnaire" element={<HobbiesQuestionnaire />} />
    </Routes>
  );
};

export default Router;
