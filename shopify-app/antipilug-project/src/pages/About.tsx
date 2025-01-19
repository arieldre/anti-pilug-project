import React from 'react';
import { Typography, Container, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <Container sx={{ paddingTop: '80px' }}>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography variant="body2" paragraph>
        Every perspective has a story, and every story has the power to connect us. This is the lesson I learned during my time in the reserves. My name is Ariel Dreyman, and during that time, I had the opportunity to meet people from all walks of life—individuals with diverse perspectives, beliefs, and opinions. Over time, I learned to appreciate and respect each of them, even when we disagreed. That experience taught me an invaluable lesson: beneath our differences, we all share the same goal: to improve our country and make it a better place for everyone.
      </Typography>
      <Typography variant="body2" paragraph>
        This realization inspired me to create something meaningful. I shared the idea with my close friend Lior Shmaya, who shares my passion for bridging divides. Together, we envisioned this project with one simple mission: to bring people closer together.
      </Typography>
      <Typography variant="body2" paragraph>
        This app isn’t just another platform—it’s built on the foundation of my own groundbreaking research, designed to replicate the transformative journey I experienced firsthand. Through careful study and testing, I developed a method that mimics the process of building understanding and empathy, just like the one I experienced during my time in the reserves. This research forms the foundation of the app, ensuring that every level and interaction is designed to help you grow as a person while connecting with others in meaningful ways.
      </Typography>
      <Typography variant="body2" paragraph>
        By following this process, you’ll discover how to develop greater empathy and openness, strengthen your communication and storytelling skills, and build deeper connections with others.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Our Vision
      </Typography>
      <Typography variant="body2" paragraph>
        We believe that meaningful conversations can bridge divides, foster understanding, and build a more united world. Through guided interactions, we empower people to listen, share, and grow together.
      </Typography>
      <Typography variant="body2" paragraph>
        We know it’s not always easy to step outside your comfort zone or engage with opposing views, but the rewards are life-changing: deeper empathy, better communication, and a renewed sense of community.
      </Typography>
      <Typography variant="body2" paragraph>
        This is just the beginning. Together, we can create a stronger, more united world—one conversation at a time.
      </Typography>
      <Typography variant="body2" paragraph>
        Take the first step today. Open your heart, start a conversation, and join us on this journey toward understanding and connection.
      </Typography>
      <Typography variant="body2" paragraph>
        Curious about the science that powers this transformation? Discover the research behind our app <Link component={RouterLink} to="/research">here</Link>.
      </Typography>
    </Container>
  );
};

export default About;