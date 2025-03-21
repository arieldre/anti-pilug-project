import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { userApi } from '../services/api';

interface ProfileData {
  name: string;
  bio: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    bio: '',
    profileImage: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, you would get the user ID from authentication
    const userId = '1'; // Placeholder
    loadProfile(userId);
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const response = await userApi.getProfile(userId);
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      const userId = '1'; // Placeholder
      await userApi.updateProfile(userId, profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={profile.profileImage}
          sx={{ width: 100, height: 100, mr: 2 }}
        />
        <Typography variant="h4">{profile.name}</Typography>
      </Box>

      {isEditing ? (
        <>
          <TextField
            fullWidth
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Profile Image URL"
            value={profile.profileImage}
            onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {profile.bio}
          </Typography>
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </>
      )}
    </Box>
  );
};

export default Profile; 