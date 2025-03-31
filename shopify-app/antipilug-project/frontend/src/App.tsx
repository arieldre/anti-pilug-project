import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Questionnaire from './pages/Questionnaire/Questionnaire';
import Home from './components/Home';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questionnaireKey, setQuestionnaireKey] = useState(Date.now());

  useEffect(() => {
    if (location.pathname === '/questionnaire') {
      // Force a remount with a timestamp
      setQuestionnaireKey(Date.now());
      console.log("Navigated to questionnaire, new key:", Date.now());
    }
  }, [location.pathname]);

  const resetQuestionnaire = () => {
    setQuestionnaireKey(Date.now());
    navigate('/questionnaire');
  };

  // Add a proper return statement with your routes
  return (
    <ThemeProvider theme={theme}>
      <Navbar onQuestionnaireClick={resetQuestionnaire} />
      <div className="app-container" style={{ paddingTop: '64px' }}> {/* Add padding for fixed navbar */}
        <Routes>
          <Route 
            path="/questionnaire" 
            element={<Questionnaire key={questionnaireKey} />}
          />
          <Route path="/" element={<Home />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
