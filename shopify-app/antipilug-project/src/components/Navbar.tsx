import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleMatchmaking = () => {
    // This function will be updated with the matchmaking algorithm
    navigate('/matchmaking');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/videos">Videos</Button>
          <Button color="inherit" component={Link} to="/courses">Courses</Button>
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
  );
};

export default Navbar;