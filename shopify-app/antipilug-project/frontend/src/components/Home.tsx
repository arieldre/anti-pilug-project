import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { contentApi } from '../services/api';

interface ContentData {
  title: string;
  description: string;
  content: any;
}

const Home: React.FC = () => {
  const [content, setContent] = useState<ContentData>({
    title: '',
    description: '',
    content: {},
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await contentApi.getContent('home');
      setContent(response.data);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {content.title}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {content.description}
        </Typography>
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="body1">
            {typeof content.content === 'string' ? content.content : JSON.stringify(content.content)}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 