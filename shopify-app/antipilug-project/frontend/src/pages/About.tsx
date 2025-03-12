import React, { useEffect, useRef, ReactNode } from 'react';
import { Typography, Container, Link, Box, Paper, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import './About.scss';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  width: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  height: '50vh',
  width: '100%',
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const ScrollRevealSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="scroll-reveal">
      {children}
    </div>
  );
};

const About: React.FC = () => {
  return (
    <div className="about-page">
      <HeroSection>
        <Typography variant="h2" className="hero-title">
          Bridging Divides, Building Understanding
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
          <Grid item xs={12}>
            <ScrollRevealSection>
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom>
                  Our Story
                </Typography>
                <Typography variant="body1" paragraph>
                  Every perspective has a story, and every story has the power to connect us. This is the lesson I learned during my time in the reserves. My name is Ariel Dreyman, and during that time, I had the opportunity to meet people from all walks of life—individuals with diverse perspectives, beliefs, and opinions. Over time, I learned to appreciate and respect each of them, even when we disagreed. That experience taught me an invaluable lesson: beneath our differences, we all share the same goal: to improve our country and make it a better place for everyone.
                </Typography>
                <Typography variant="body1" paragraph>
                  This realization inspired me to create something meaningful. I shared the idea with my close friend Lior Shmaya, who shares my passion for bridging divides. Together, we envisioned this project with one simple mission: to bring people closer together.
                </Typography>
                <Typography variant="body1" paragraph>
                  This app isn't just another platform—it's built on the foundation of my own groundbreaking research, designed to replicate the transformative journey I experienced firsthand. Through careful study and testing, I developed a method that mimics the process of building understanding and empathy, just like the one I experienced during my time in the reserves. This research forms the foundation of the app, ensuring that every level and interaction is designed to help you grow as a person while connecting with others in meaningful ways.
                </Typography>
                <Typography variant="body1" paragraph>
                  By following this process, you'll discover how to develop greater empathy and openness, strengthen your communication and storytelling skills, and build deeper connections with others.
                </Typography>
              </StyledPaper>
            </ScrollRevealSection>
          </Grid>

          <Grid item xs={12}>
            <ScrollRevealSection>
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom>
                  Our Vision
                </Typography>
                <Typography variant="body1" paragraph>
                  We believe that meaningful conversations can bridge divides, foster understanding, and build a more united world. Through guided interactions, we empower people to listen, share, and grow together.
                </Typography>
                <Typography variant="body1" paragraph>
                  We know it's not always easy to step outside your comfort zone or engage with opposing views, but the rewards are life-changing: deeper empathy, better communication, and a renewed sense of community.
                </Typography>
                <Typography variant="body1" paragraph>
                  This is just the beginning. Together, we can create a stronger, more united world—one conversation at a time.
                </Typography>
                <Typography variant="body1" paragraph>
                  Take the first step today. Open your heart, start a conversation, and join us on this journey toward understanding and connection.
                </Typography>
                <Typography variant="body1">
                  Curious about the science that powers this transformation? Discover the research behind our app{' '}
                  <Link component={RouterLink} to="/research" className="styled-link">
                    here
                  </Link>
                  .
                </Typography>
              </StyledPaper>
            </ScrollRevealSection>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default About;