import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { MonetizationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import './Profile.scss';
import { contentApi, userApi, questionApi } from '../services/api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Get user ID from auth context or local storage
        const userId = localStorage.getItem('userId'); // or context
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        const response = await axios.get(`/api/users/${userId}`);
        setUserProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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

  // Move user data definition before using it
  const user = {
    name: 'John Doe',
    coins: 120,
    level: 5,
    points: 350,
    xpToNextLevel: 500,
    callsMade: 30,
    likesReceived: 150,
    lastCalls: [
      { date: '2023-10-01', duration: '15 mins', liked: true },
      { date: '2023-09-30', duration: '20 mins', liked: false },
      { date: '2023-09-29', duration: '10 mins', liked: true },
    ],
    dailyStreak: 7,
    bio: 'Passionate about bridging political divides.',
    age: 28,
    picture: 'https://via.placeholder.com/150',
    questionnaireChangesLeft: 3,
  };

  // Initialize state after user object is defined
  const [remainingChanges, setRemainingChanges] = useState(user.questionnaireChangesLeft);

  const friends = [
    { name: 'Alice', level: 3, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Bob', level: 4, online: false, picture: 'https://via.placeholder.com/50' },
    { name: 'Charlie', level: 2, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'David', level: 5, online: false, picture: 'https://via.placeholder.com/50' },
    { name: 'Eve', level: 1, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Frank', level: 3, online: false, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
  ];

  const handleLevelClick = () => {
    navigate('/build-city', { state: { level: user.level, points: user.points } });
  };

  const handleStatisticsClick = () => {
    navigate('/statistics');
  };

  const handleQuestionnaireClick = () => {
    if (user.level >= 3 && remainingChanges > 0) {
      console.log('Previous remaining changes:', remainingChanges);
      setRemainingChanges(prev => prev - 1);
      console.log('New remaining changes:', remainingChanges - 1);
      navigate('/questionnaires/political'); // Make sure this route exists in your router
    }
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitQuestionnaire = async () => {
    setSubmitting(true);
    try {
      const userId = localStorage.getItem('userId'); // or from context
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await axios.post('/api/user-questions', {
        userId,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId: parseInt(questionId),
          value: value
        }))
      });
      
      // Handle successful submission - maybe show a success message
      setSubmitError(null);
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      setSubmitError('Failed to submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile">
      {/* Profile Header */}
      <header className="profile-header">
        <Avatar alt={user.name} src={user.picture} className="profile-picture" />
        <Box className="profile-info">
          <Typography variant="h4" className="profile-name">
            {user.name}
          </Typography>
          <Typography variant="body1" className="profile-bio">
            {user.bio}
          </Typography>
          <Typography variant="body2" className="profile-age">
            Age: {user.age}
          </Typography>
          <Box className="profile-coins">
            <MonetizationOn className="coins-icon" />
            <Typography variant="body1">{user.coins}</Typography>
          </Box>
        </Box>
      </header>

      {/* Profile Details */}
      <div className="profile-details">
        {/* Main Cards */}
        <div className="main-cards">
          <Card className="profile-card level-card" onClick={handleLevelClick}>
            <CardContent>
              <Typography variant="h6">Level</Typography>
              <Typography variant="body1">Level {user.level}</Typography>
              <LinearProgress
                variant="determinate"
                value={(user.points / user.xpToNextLevel) * 100}
                className="level-progress"
              />
              <Typography variant="body2">
                {user.points} / {user.xpToNextLevel} Points
              </Typography>
            </CardContent>
          </Card>

          <Card className="profile-card statistics-card" onClick={handleStatisticsClick}>
            <CardContent>
              <Typography variant="h6">Statistics</Typography>
              <Typography variant="body1">Calls Made: {user.callsMade}</Typography>
              <Typography variant="body1">Likes Received: {user.likesReceived}</Typography>
              <Typography variant="body1">Daily Streak: {user.dailyStreak} days</Typography>
            </CardContent>
          </Card>

          <Card className="profile-card call-history-card">
            <CardContent>
              <Typography variant="h6">Call History</Typography>
              {user.lastCalls.map((call, index) => (
                <Typography key={index} variant="body2">
                  {call.date} - {call.duration} - {call.liked ? 'Liked' : 'Not Liked'}
                </Typography>
              ))}
            </CardContent>
          </Card>

          {/* Conditionally render Questionnaire Card */}
          {user.level >= 3 ? (
            <Tooltip title={`${remainingChanges} changes remaining`} arrow placement="top">
              <Card 
                className={`profile-card questionnaire-card ${remainingChanges === 0 ? 'questionnaire-card-locked' : ''}`}
                onClick={() => remainingChanges > 0 ? handleQuestionnaireClick() : null}
                sx={{ cursor: remainingChanges > 0 ? 'pointer' : 'not-allowed' }}
              >
                <CardContent>
                  <Typography variant="h6">Change my personal Questionnaire</Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {remainingChanges > 0 
                        ? `Update your preferences - ${remainingChanges} changes remaining`
                        : 'No more changes available'}
                    </Typography>
                    {remainingChanges > 0 && <EditIcon />}
                  </Box>
                </CardContent>
              </Card>
            </Tooltip>
          ) : (
            <Tooltip title="Unlocks at Level 3" arrow placement="top">
              <Card className="profile-card questionnaire-card-locked">
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Change my personal Questionnaire</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="error">
                      Reach level 3 to unlock the ability to change your questionnaire
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Tooltip>
          )}
        </div>

        {/* Friends Card */}
        <div className="friends-container">
          <Card className="profile-card friends-card">
            <CardContent>
              <Typography variant="h6">Friends</Typography>
              <List className="friends-list">
                {friends.map((friend, index) => (
                  <ListItem key={index} className={`friend-item ${friend.online ? 'online' : 'offline'}`}>
                    <ListItemAvatar>
                      <Avatar alt={friend.name} src={friend.picture} />
                    </ListItemAvatar>
                    <ListItemText primary={friend.name} secondary={`Level ${friend.level}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
