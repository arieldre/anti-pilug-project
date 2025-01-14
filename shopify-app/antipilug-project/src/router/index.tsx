import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProfileQuestions from '../pages/ProfileQuestions';
import MatchmakingQuestions from '../pages/MatchmakingQuestions';
import RewardSystem from '../pages/RewardSystem';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile-questions" element={<ProfileQuestions />} />
      <Route path="/matchmaking-questions" element={<MatchmakingQuestions />} />
      <Route path="/reward-system" element={<RewardSystem />} />
    </Routes>
  );
};

export default Router;