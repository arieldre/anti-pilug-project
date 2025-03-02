import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Paper, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import './Shop.scss';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  width: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#ffffff', // White background for paper
  color: '#000000', // Black text
  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  height: '50vh',
  width: '100%',
  background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const Shop: React.FC = () => {
  const [coins, setCoins] = useState(1000); // Example initial coins, should be fetched from profile

  const handlePurchase = (cost: number) => {
    if (coins >= cost) {
      setCoins(coins - cost);
      // Update coins in profile (API call or state management)
    } else {
      alert('Not enough coins');
    }
  };

  return (
    <div className="shop-page">
      <HeroSection>
        <Typography variant="h2" className="hero-title">
          Welcome to the Shop
        </Typography>
        <Typography variant="h6" className="hero-subtitle">
          Coins: {coins}
        </Typography>
      </HeroSection>

      <Container 
        maxWidth="lg" 
        className="content-container"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1200px !important'
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h4" gutterBottom>
                Courses
              </Typography>
              <Typography variant="body1" paragraph>
                Learn new skills and improve your knowledge.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handlePurchase(100)}>
                Buy for 100 coins
              </Button>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h4" gutterBottom>
                Backgrounds
              </Typography>
              <Typography variant="body1" paragraph>
                Customize your profile with new backgrounds.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handlePurchase(50)}>
                Buy for 50 coins
              </Button>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h4" gutterBottom>
                Make Up
              </Typography>
              <Typography variant="body1" paragraph>
                Enhance your appearance with new make up items.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handlePurchase(75)}>
                Buy for 75 coins
              </Button>
            </StyledPaper>
          </Grid>

          {/* Add more sectors as needed */}
        </Grid>
      </Container>
    </div>
  );
};

export default Shop;