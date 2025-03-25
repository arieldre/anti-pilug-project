import React, { useEffect, useState } from 'react';
import { contentAPI } from '../services/api';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const Home: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await contentAPI.getContent('home');
        setContent(data);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome to Anti-Pilug
      </Typography>
      {content && (
        <Box>
          {/* Render your content here */}
          <Typography variant="body1">{content.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Home; 