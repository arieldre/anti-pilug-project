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
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { MonetizationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import './Profile.scss';
import { userAPI } from '../services/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  birthDate: string;
  education: string;
  militaryService: string | null;
  coins: number;
  level: number;
  points: number;
  xpToNextLevel: number;
  callsMade: number;
  likesReceived: number;
  lastCalls: Array<{
    date: string;
    duration: string;
    liked: boolean;
  }>;
  dailyStreak: number;
  bio: string;
  questionnaireChangesLeft: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userAPI.getProfile();
      setUserProfile(userData);
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

  // Initialize state after userProfile is loaded
  const [remainingChanges, setRemainingChanges] = useState(
    userProfile?.questionnaireChangesLeft || 0
  );

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
    navigate('/build-city', { state: { level: userProfile?.level, points: userProfile?.points } });
  };

  const handleStatisticsClick = () => {
    navigate('/statistics');
  };

  const handleQuestionnaireClick = () => {
    if (userProfile?.level >= 3 && remainingChanges > 0) {
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

  if (!userProfile) {
    return (
      <Box p={3}>
        <Alert severity="error">No user data available</Alert>
      </Box>
    );
  }

  return (
    <div className="profile">
      {/* Profile Header */}
      <header className="profile-header">
        <Avatar alt={userProfile.name} src={userProfile.profileImage} className="profile-picture" />
        <Box className="profile-info">
          <Typography variant="h4" className="profile-name">
            {userProfile.name}
          </Typography>
          <Typography variant="body1" className="profile-bio">
            {userProfile.bio}
          </Typography>
          <Typography variant="body2" className="profile-age">
            Age: {calculateAge(userProfile.birthDate)}
          </Typography>
          <Box className="profile-coins">
            <MonetizationOn className="coins-icon" />
            <Typography variant="body1">{userProfile.coins}</Typography>
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
              <Typography variant="body1">Level {userProfile.level}</Typography>
              <LinearProgress
                variant="determinate"
                value={(userProfile.points / userProfile.xpToNextLevel) * 100}
                className="level-progress"
              />
              <Typography variant="body2">
                {userProfile.points} / {userProfile.xpToNextLevel} Points
              </Typography>
            </CardContent>
          </Card>

          <Card className="profile-card statistics-card" onClick={handleStatisticsClick}>
            <CardContent>
              <Typography variant="h6">Statistics</Typography>
              <Typography variant="body1">Calls Made: {userProfile.callsMade}</Typography>
              <Typography variant="body1">Likes Received: {userProfile.likesReceived}</Typography>
              <Typography variant="body1">Daily Streak: {userProfile.dailyStreak} days</Typography>
            </CardContent>
          </Card>

          <Card className="profile-card call-history-card">
            <CardContent>
              <Typography variant="h6">Call History</Typography>
              {userProfile.lastCalls.map((call, index) => (
                <Typography key={index} variant="body2">
                  {call.date} - {call.duration} - {call.liked ? 'Liked' : 'Not Liked'}
                </Typography>
              ))}
            </CardContent>
          </Card>

          {/* Conditionally render Questionnaire Card */}
          {userProfile.level >= 3 ? (
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

// Helper function to calculate age
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default Profile;
