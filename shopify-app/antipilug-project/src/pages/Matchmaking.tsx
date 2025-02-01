import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Matchmaking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleMatchmaking = () => {
    if (window.confirm('Do you want to play a game while you wait?')) {
      navigate('/flappy-bird-game');
    } else {
      // Proceed with matchmaking logic here
    }
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/videos">Videos</Button>
            <Button color="inherit" component={Link} to="/shop">Shop</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/help-center">Help Center</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputBase
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
              sx={{ color: 'inherit', marginRight: '0.5rem' }}
            />
            <IconButton color="inherit" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
            <Button color="inherit" onClick={handleMatchmaking}>Matchmaking</Button>
          </div>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Matchmaking Page
        </Typography>
        <Button variant="contained" color="primary" onClick={handleMatchmaking}>
          Start Matchmaking
        </Button>
      </Box>
    </Box>
  );
};

export default Matchmaking;