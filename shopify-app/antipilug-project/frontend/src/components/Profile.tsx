import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Avatar, Paper } from '@mui/material';
import { userAPI, contentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userAPI.getProfile();
      setUser(userData);
      
      // Fetch user's content
      const contentData = await contentAPI.getContent('profile');
      setContent(contentData);
    } catch (err) {
      if (err instanceof Error && err.message === 'User not authenticated') {
        navigate('/login');
      } else {
        setError('Failed to load profile. Please try again later.');
        console.error('Error fetching user profile:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={user?.avatar || 'https://via.placeholder.com/150'}
            alt={user?.name}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="h4">{user?.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {content && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Content
          </Typography>
          <Typography variant="body1">
            {content.description}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Profile; 