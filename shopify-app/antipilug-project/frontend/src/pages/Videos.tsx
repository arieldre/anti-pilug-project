// filepath: /c:/Users/arara/OneDrive/שולחן העבודה/projectantipilug/shopify-app/shopify-app/antipilug-project/src/pages/Videos.tsx
import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { 
  Search, 
  ThumbUp,
  Share,
  Bookmark
} from '@mui/icons-material';
import './Videos.scss';
import { useNavigate } from 'react-router-dom';
import { contentAPI } from '../services/api';

interface Video {
  _id: string;
  type: 'video' | 'research' | 'news';
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  date: string;
  tags: string[];
  education: string;
  militaryService: string;
  city: string;
  level: number;
  politicalAlignment: number;
}

interface Filters {
  searchQuery: string;
  education: string;
  militaryService: string;
  city: string;
  sortBy: 'recent' | 'popular' | 'relevant';
}

const Videos: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    education: '',
    militaryService: '',
    city: '',
    sortBy: 'recent'
  });

  useEffect(() => {
    fetchVideos();
  }, [filters.sortBy]); // Refetch when sort changes

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await contentAPI.getRecommendedContent();
      // Filter to only include video type content
      setVideos(data.filter(item => item.type === 'video'));
    } catch (err) {
      setError('Failed to load videos. Please try again later.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (field: keyof Filters) => (
    event: SelectChangeEvent
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: event.target.value
    }));
  };

  const handleVideoClick = (video: Video) => {
    if (video.link) {
      window.open(video.link, '_blank');
    }
  };

  const filterVideos = (videos: Video[]) => {
    return videos.filter(video => {
      // Search query filter
      if (filters.searchQuery && !video.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !video.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Education filter
      if (filters.education && video.education !== filters.education) {
        return false;
      }

      // Military service filter
      if (filters.militaryService && video.militaryService !== filters.militaryService) {
        return false;
      }

      // City filter
      if (filters.city && video.city !== filters.city) {
        return false;
      }

      return true;
    });
  };

  const sortVideos = (videos: Video[]) => {
    const sortedVideos = [...videos];
    switch (filters.sortBy) {
      case 'recent':
        return sortedVideos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'popular':
        // For now, sort by political alignment as a proxy for popularity
        return sortedVideos.sort((a, b) => Math.abs(a.politicalAlignment) - Math.abs(b.politicalAlignment));
      case 'relevant':
        // For now, sort by level
        return sortedVideos.sort((a, b) => b.level - a.level);
      default:
        return sortedVideos;
    }
  };

  const filteredAndSortedVideos = sortVideos(filterVideos(videos));

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
    <Container maxWidth="lg" className="videos-page">
      <Box className="header" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Videos
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Explore diverse political perspectives through our curated video collection
        </Typography>
      </Box>

      <Box className="filters-section" mb={4}>
        <TextField
          fullWidth
          className="search-field"
          placeholder="Search videos..."
          variant="outlined"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Education</InputLabel>
              <Select
                value={filters.education}
                onChange={handleSelectChange('education')}
                label="Education"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High School">High School</MenuItem>
                <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Military Service</InputLabel>
              <Select
                value={filters.militaryService}
                onChange={handleSelectChange('militaryService')}
                label="Military Service"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Veteran">Veteran</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={filters.city}
                onChange={handleSelectChange('city')}
                label="City"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Tel Aviv">Tel Aviv</MenuItem>
                <MenuItem value="Jerusalem">Jerusalem</MenuItem>
                <MenuItem value="Haifa">Haifa</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={handleSelectChange('sortBy')}
                label="Sort By"
              >
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="relevant">Most Relevant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredAndSortedVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <Card 
              className="video-card" 
              onClick={() => handleVideoClick(video)}
              sx={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                height="200"
                image={video.imageUrl}
                alt={video.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {video.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(video.date).toLocaleDateString()}
                  </Typography>
                  <Box>
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
                </Box>
                <Box>
                  {video.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAndSortedVideos.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No videos found matching your filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Videos;

