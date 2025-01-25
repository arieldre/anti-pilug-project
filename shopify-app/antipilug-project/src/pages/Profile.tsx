import React from 'react';
import { Avatar, Card, CardContent, Typography, Grid, LinearProgress, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { MonetizationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Dummy data for demonstration purposes
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
  };

  const friends = [
    { name: 'Alice', level: 3, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Bob', level: 4, online: false, picture: 'https://via.placeholder.com/50' },
    { name: 'Charlie', level: 2, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'David', level: 5, online: false, picture: 'https://via.placeholder.com/50' },
    { name: 'Eve', level: 1, online: true, picture: 'https://via.placeholder.com/50' },
    { name: 'Frank', level: 3, online: false, picture: 'https://via.placeholder.com/50' },
    { name: 'Grace', level: 4, online: true, picture: 'https://via.placeholder.com/50' },
  ];

  const handleLevelClick = () => {
    navigate('/build-city', { state: { level: user.level, points: user.points } });
  };

  const handleStatisticsClick = () => {
    navigate('/statistics');
  };

  return (
    <div className="profile">
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

      <Grid container spacing={3} className="profile-details">
        <Grid item xs={12} sm={6} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className="profile-card statistics-card" onClick={handleStatisticsClick}>
                <CardContent>
                  <Typography variant="h6">Statistics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1">Calls Made: {user.callsMade}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1">Likes Received: {user.likesReceived}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1">Daily Streak: {user.dailyStreak} days</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className="profile-card">
                <CardContent>
                  <Typography variant="h6">Call History</Typography>
                  {user.lastCalls.map((call, index) => (
                    <Typography key={index} variant="body2">
                      {call.date} - {call.duration} - {call.liked ? 'Liked' : 'Not Liked'}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="profile-card friends-card">
            <CardContent>
              <Typography variant="h6">Friends</Typography>
              <List className="friends-list">
                {friends.map((friend, index) => (
                  <ListItem key={index} className={`friend-item ${friend.online ? 'online' : 'offline'}`}>
                    <ListItemAvatar>
                      <Avatar alt={friend.name} src={friend.picture} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend.name}
                      secondary={`Level ${friend.level}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;