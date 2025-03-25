import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { videoAPI } from '../services/api';

type SortOption = 'recent' | 'popular' | 'relevant';

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoAPI.getVideos(sortBy);
      setVideos(data);
    } catch (err) {
      setError('Failed to load videos. Please try again later.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [sortBy]);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Videos</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="relevant">Most Relevant</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {videos.length === 0 ? (
        <Typography>No videos found.</Typography>
      ) : (
        <Box>
          {videos.map((video) => (
            <Box key={video.id} mb={2}>
              <Typography variant="h6">{video.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {video.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Videos; 