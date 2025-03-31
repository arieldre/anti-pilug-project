import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles/Home.scss';
import { contentAPI } from '../services/api';

interface ContentItem {
  _id: string;
  type: 'video' | 'research' | 'news';
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link: string;
  tags: string[];
  education: string;
  militaryService: string;
  city: string;
  level: number;
  politicalAlignment: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'research' | 'news'>('all');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await contentAPI.getRecommendedContent();
        // Only show videos and research content on home page
        setContent(data.filter(item => item.type === 'video' || item.type === 'research'));
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'all' | 'video' | 'research' | 'news') => {
    setActiveTab(newValue);
  };

  const handleShare = (item: ContentItem) => {
    // Implement share functionality
    console.log('Sharing:', item);
  };

  const handleViewMore = (type: 'video' | 'research') => {
    if (type === 'video') {
      navigate('/videos');
    } else {
      navigate('/research');
    }
  };

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => item.type === activeTab);

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
    <div className="home-page">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Typography variant="h1" className="hero-title">
            Anti-Plugging Solutions
          </Typography>
          <Typography variant="h4" className="hero-subtitle">
            Stay informed with personalized content based on your profile
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={() => {
              document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Recommended Content
          </Button>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" id="content-section">
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" value="all" />
            <Tab label="Videos" value="video" />
            <Tab label="Research" value="research" />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {filteredContent.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card 
                className="content-card"
                onClick={() => item.link !== '#' && window.open(item.link, '_blank')}
              >
                <CardMedia
                  component="img"
                  height="225"
                  image={item.imageUrl}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.date).toLocaleDateString()}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(item);
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Box>
                  <Box mt={1}>
                    {item.tags.map((tag) => (
                      <Chip
                        key={tag}
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

        {activeTab === 'all' && (
          <Box display="flex" justifyContent="center" mt={4} gap={2}>
            <Button 
              variant="contained" 
              onClick={() => handleViewMore('video')}
            >
              View All Videos
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleViewMore('research')}
            >
              View All Research
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Home;