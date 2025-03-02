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
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles/Home.scss';

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

  // Simulate fetching content
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockContent: ContentItem[] = [
        {
          id: 1,
          type: 'video',
          title: 'Understanding Anti-Plugging Techniques',
          description: 'Learn about the latest anti-plugging strategies and their implementation.',
          imageUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          date: '2024-02-15',
          link: '/video/1',
          tags: ['security', 'anti-plug', 'tutorial']
        },
        {
          id: 2,
          type: 'video',
          title: 'Advanced Security Measures in Gaming',
          description: 'Deep dive into protecting gaming platforms from unauthorized modifications.',
          imageUrl: 'https://img.youtube.com/vi/JZYZoQQ6LJQ/maxresdefault.jpg',
          date: '2024-02-14',
          link: '/video/2',
          tags: ['gaming', 'security', 'advanced']
        },
        {
          id: 3,
          type: 'news',
          title: 'Major Security Breach Prevention Success',
          description: 'How a leading gaming company prevented a massive security breach using anti-plugging solutions.',
          imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
          date: '2024-02-13',
          link: '/news/1',
          tags: ['news', 'success-story', 'case-study']
        },
        {
          id: 4,
          type: 'video',
          title: 'Real-time Protection Systems',
          description: 'Implementing real-time monitoring and protection against unauthorized modifications.',
          imageUrl: 'https://img.youtube.com/vi/Y8Wp3dafaMQ/maxresdefault.jpg',
          date: '2024-02-12',
          link: '/video/3',
          tags: ['real-time', 'monitoring', 'protection']
        },
        {
          id: 5,
          type: 'news',
          title: 'Industry Standards Update 2024',
          description: 'New security standards and regulations for anti-plugging measures in software.',
          imageUrl: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28',
          date: '2024-02-11',
          link: '/news/2',
          tags: ['standards', 'regulations', 'industry']
        },
        {
          id: 6,
          type: 'video',
          title: 'Secure Code Implementation',
          description: 'Best practices for implementing secure code against unauthorized modifications.',
          imageUrl: 'https://img.youtube.com/vi/K7gLvB0ve-Y/maxresdefault.jpg',
          date: '2024-02-10',
          link: '/video/4',
          tags: ['coding', 'best-practices', 'implementation']
        },
        {
          id: 7,
          type: 'news',
          title: 'Anti-Plugging Technology Trends',
          description: 'Latest trends and innovations in anti-plugging security measures.',
          imageUrl: '/assets/trends-2024.jpg',
          date: '2024-02-09',
          link: '/news/3',
          tags: ['trends', 'innovation', 'technology']
        },
        {
          id: 8,
          type: 'talk',
          title: 'Security Conference Keynote 2024',
          description: 'Highlights from the annual security conference focusing on anti-plugging solutions.',
          imageUrl: '/assets/conference-2024.jpg',
          date: '2024-02-08',
          link: '/talk/1',
          tags: ['conference', 'keynote', 'industry-event']
        }
      ];
      
      setTimeout(() => {
        setContent(mockContent);
        setLoading(false);
      }, 1000);
    };

    fetchContent();
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