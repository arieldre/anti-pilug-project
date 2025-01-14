import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile-questions">Profile Questions</Link></li>
        <li><Link to="/matchmaking-questions">Matchmaking Questions</Link></li>
        <li><Link to="/reward-system">Reward System</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;