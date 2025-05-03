import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import Router from './router/index';
import './styles/videoflow.scss';

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
  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <Router />
      </div>
    </ThemeProvider>
  );
};

export default App;
