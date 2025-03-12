import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles/Home.scss';
import { contentApi, userApi, questionApi } from '../services/api';

interface ContentItem {
  id: number;
  type: 'video' | 'talk' | 'research' | 'news';
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link: string;
  tags: string[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await contentApi.getContent();
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleShare = (item: ContentItem) => {
    // Implement share functionality
    console.log('Sharing:', item);
  };

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => item.type === activeTab);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Typography variant="h1" className="hero-title">
            Anti-Plugging Solutions
          </Typography>
          <Typography variant="h4" className="hero-subtitle">
            Stay informed with the latest updates and insights
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={() => {
              document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Latest Updates
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
            <Tab label="Talks" value="talk" />
            <Tab label="Research" value="research" />
            <Tab label="News" value="news" />
          </Tabs>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredContent.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card 
                  className="content-card"
                  onClick={() => navigate(item.link)}
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
        )}
      </Container>
    </div>
  );
};

export default Home;