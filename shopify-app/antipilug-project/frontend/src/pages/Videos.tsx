// filepath: /c:/Users/arara/OneDrive/שולחן העבודה/projectantipilug/shopify-app/shopify-app/antipilug-project/src/pages/Videos.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip,
  TextField,
  InputAdornment,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Search, 
  FilterList,
  ThumbUp,
  Share,
  Bookmark
} from '@mui/icons-material';
import './Videos.scss';
import { useNavigate } from 'react-router-dom';

// Move mockVideos to a separate file to keep component clean
import { generateMockVideos } from '../utils/mockData.ts';

const VIDEOS_PER_PAGE = 12;

const Videos: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    subject: '',
    politicalSide: '',
    country: '',
    sortBy: 'recent'
  });

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // Initial load
  useEffect(() => {
    loadInitialVideos();
  }, []);

  const loadInitialVideos = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const initialVideos = generateMockVideos(1, VIDEOS_PER_PAGE);
      setVideos(initialVideos);
      setPage(2);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight) {
      if (!loading && hasMore) {
        loadMoreVideos();
      }
    }
  }, [loading, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadMoreVideos = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newVideos = generateMockVideos(page, VIDEOS_PER_PAGE);
      if (newVideos.length < VIDEOS_PER_PAGE) {
        setHasMore(false);
      }
      
      setVideos(prev => [...prev, ...newVideos]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string) => (event: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="#fff"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="videos-page">
      <header className="header">
        <Typography variant="h3" component="h1" className="title">
          Videos
        </Typography>
        <Typography variant="body1" className="subtitle">
          Explore diverse political perspectives through our curated video collection
        </Typography>
      </header>

      <div className="filters-section">
        <TextField
          className="search-field"
          placeholder="Search videos..."
          variant="outlined"
          value={selectedFilters.searchQuery}
          onChange={(e) => setSelectedFilters({ ...selectedFilters, searchQuery: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Box className="filters-container">
          <FormControl className="filter-control">
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedFilters.subject}
              onChange={handleFilterChange('subject')}
              label="Subject"
            >
              <MenuItem value="economics">Economics</MenuItem>
              <MenuItem value="healthcare">Healthcare</MenuItem>
              <MenuItem value="foreign-policy">Foreign Policy</MenuItem>
              <MenuItem value="education">Education</MenuItem>
            </Select>
          </FormControl>

          <FormControl className="filter-control">
            <InputLabel>Political Side</InputLabel>
            <Select
              value={selectedFilters.politicalSide}
              onChange={handleFilterChange('politicalSide')}
              label="Political Side"
            >
              <MenuItem value="left">Left-wing</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right-wing</MenuItem>
            </Select>
          </FormControl>

          <FormControl className="filter-control">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedFilters.country}
              onChange={handleFilterChange('country')}
              label="Country"
            >
              <MenuItem value="usa">USA</MenuItem>
              <MenuItem value="uk">UK</MenuItem>
              <MenuItem value="eu">European Union</MenuItem>
            </Select>
          </FormControl>

          <FormControl className="filter-control">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={selectedFilters.sortBy}
              onChange={handleFilterChange('sortBy')}
              label="Sort By"
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="relevant">Most Relevant</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      <Grid container spacing={3} className="videos-grid">
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card className="video-card" onClick={() => handleVideoClick(video.id)}>
              <CardMedia
                component="div"
                className="video-thumbnail"
                image={video.thumbnail}
              >
                <div className="video-duration">{video.duration}</div>
              </CardMedia>
              <CardContent>
                <Typography variant="h6" className="video-title">
                  {video.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {video.channel} • {video.views} views • {video.timestamp}
                </Typography>
                <Box className="video-tags">
                  {video.tags.map((tag: string, index: number) => (
                    <Chip key={index} label={tag} size="small" className="tag-chip" />
                  ))}
                </Box>
                <Box className="video-actions">
                  <Tooltip title="Like">
                    <IconButton size="small">
                      <ThumbUp />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save">
                    <IconButton size="small">
                      <Bookmark />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small">
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Videos;

