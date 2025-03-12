import React, { useEffect, useRef, ReactNode } from 'react';
import { Typography, Container, Link, Box, Paper, Grid } from '@mui/material';
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

const Research: React.FC = () => {
  return (
    <div className="about-page">
      <HeroSection>
        <Typography variant="h2" className="hero-title">
          Understanding Through Research
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
                  Research Process
                </Typography>
                <Typography variant="body1" paragraph>
                  Our research aimed to bridge divides and foster understanding among people with different political views. We divided participants into two groups based on their political beliefs.
                </Typography>
                <Typography variant="body1" paragraph>
                  The study consisted of five rounds, each lasting six minutes. In each round, participants from both groups were given three minutes to share stories on a chosen topic. The goal was for participants to find similarities between themselves and others, and by the end of the five rounds, to realize that they have commonalities not just with one person from the other group, but potentially with everyone.
                </Typography>
                <Typography variant="body1" paragraph>
                  The goal of the research was to create a feeling called "kama muta". Kama muta is our scientific name for an emotion that has names in many languages (but not all). In English, it overlaps closely with being moved to tears. This feeling has been checked in previous research and exists globally.
                </Typography>
              </StyledPaper>
            </ScrollRevealSection>
          </Grid>

          <Grid item xs={12}>
            <ScrollRevealSection>
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom>
                  Research Findings
                </Typography>
                <Typography variant="body1" paragraph>
                  This method was designed to help participants understand that despite their differences, they share many common goals and values. The results of this research will be added soon.
                </Typography>
                <Typography variant="body1">
                  This is the latest study about kama muta: Blomster Lyshol, J. K., Seibt, B., Oliver, M. B., & Thomsen, L. (2022). Moving political opponents closer: How kama muta can contribute to reducing the partisan divide in the US. Group Processes & Intergroup Relations.{' '}
                  <Link 
                    href="https://doi.org/10.1177/13684302211067152" 
                    target="_blank" 
                    rel="noopener"
                    className="styled-link"
                  >
                    https://doi.org/10.1177/13684302211067152
                  </Link>
                </Typography>
              </StyledPaper>
            </ScrollRevealSection>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Research;