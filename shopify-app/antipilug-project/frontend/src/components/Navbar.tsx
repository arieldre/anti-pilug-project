import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

// Styled component for the search container
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '200px',
  transition: 'all 0.3s ease',
  '&.focused': {
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Add this prop to your component
interface NavbarProps {
  onQuestionnaireClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onQuestionnaireClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/videos?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleQuestionnaireClick = (event: React.MouseEvent) => {
    if (onQuestionnaireClick) {
      event.preventDefault();
      onQuestionnaireClick();
    }
  };

  const menuItems = [
    {
      label: 'Home',
      path: '/',
      icon: <span className="nav-icon">🏠</span>,
    },
    {
      label: 'Videos',
      path: '/videos',
    },
    {
      label: 'Shop',
      path: '/shop',
    },
    {
      label: 'Matchmaking',
      path: '/matchmaking',
    },
    {
      label: 'Help Center',
      path: '/help-center',
    },
    {
      label: 'About',
      path: '/about',
    },
    {
      label: 'Questionnaire',
      path: '/questionnaire',  // Match the route in App.tsx
      icon: <span className="nav-icon">📝</span>,
    },
    
   
  ];

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                className="nav-button"
                onClick={item.path === '/questionnaire' ? handleQuestionnaireClick : undefined}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Typography>
        <Search className={isSearchFocused ? 'focused' : ''}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyPress={handleKeyPress}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Button color="inherit" onClick={handleProfile}>Profile</Button>
      </Toolbar>
    </AppBar>
  );
};

Navbar.defaultProps = {
  onQuestionnaireClick: undefined
};

export default Navbar;