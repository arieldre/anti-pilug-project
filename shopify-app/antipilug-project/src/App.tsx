import React from 'react';
import Navbar from './components/Navbar';
import Router from './router';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Router />
    </div>
  );
};

export default App;
