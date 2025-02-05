import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from '@mui/material';
import { ThumbUp, Sort } from '@mui/icons-material';
import { generateMockVideos } from '../utils/mockData';
import './VideoPage.scss';

interface Comment {
  id: number;
  userId: number;
  username: string;
  userLevel: number;
  content: string;
  likes: number;
  timestamp: string;
  userAvatar: string;
}

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentSort, setCommentSort] = useState('recent');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Simulate fetching video data
    const allVideos = generateMockVideos(1, 50);
    const currentVideo = allVideos.find(v => v.id === Number(id));
    setVideo(currentVideo);

    // Generate related videos based on tags
    const related = allVideos
      .filter(v => v.id !== Number(id))
      .filter(v => v.tags.some((tag: string) => currentVideo.tags.includes(tag)))
      .slice(0, 8);
    setRelatedVideos(related);

    // Generate mock comments
    const mockComments: Comment[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      userId: i + 1,
      username: `User${i + 1}`,
      userLevel: Math.floor(Math.random() * 10) + 1,
      content: `This is a sample comment ${i + 1}. It provides some perspective on the video's topic.`,
      likes: Math.floor(Math.random() * 100),
      timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
      userAvatar: `https://i.pravatar.cc/150?u=${i + 1}`,
    }));
    setComments(mockComments);
  }, [id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: comments.length + 1,
      userId: 999,
      username: 'CurrentUser',
      userLevel: 5,
      content: newComment,
      likes: 0,
      timestamp: 'Just now',
      userAvatar: 'https://i.pravatar.cc/150?u=999',
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const sortComments = (type: string) => {
    setCommentSort(type);
    let sortedComments = [...comments];
    switch (type) {
      case 'recent':
        // Already in correct order in our mock
        break;
      case 'likes':
        sortedComments.sort((a, b) => b.likes - a.likes);
        break;
      case 'level':
        sortedComments.sort((a, b) => b.userLevel - a.userLevel);
        break;
    }
    setComments(sortedComments);
  };

  const handleRelatedVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-page-wrapper">
      <Grid container spacing={3} className="video-page">
        <Grid item xs={12} md={8}>
          <div className="video-container">
            <img src={video.thumbnail} alt={video.title} className="video-placeholder" />
          </div>
          <Typography variant="h5" className="video-title">{video.title}</Typography>
          <div className="video-info">
            <Typography variant="body2">{video.views} views • {video.timestamp}</Typography>
            <div className="video-tags">
              {video.tags.map((tag: string, index: number) => (
                <Chip key={index} label={tag} size="small" className="tag-chip" />
              ))}
            </div>
          </div>

          <div className="comments-section">
            <div className="comments-header">
              <Typography variant="h6">Comments</Typography>
              <FormControl size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={commentSort}
                  onChange={(e) => sortComments(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="recent">Most Recent</MenuItem>
                  <MenuItem value="likes">Most Liked</MenuItem>
                  <MenuItem value="level">Highest Level</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="comment-input">
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </div>

            <div className="comments-list">
              {comments.map((comment) => (
                <Card key={comment.id} className="comment-card">
                  <CardContent>
                    <div className="comment-header">
                      <div className="user-info">
                        <Avatar src={comment.userAvatar} />
                        <div>
                          <Typography variant="subtitle2">{comment.username}</Typography>
                          <Chip
                            size="small"
                            label={`Level ${comment.userLevel}`}
                            className="level-chip"
                          />
                        </div>
                      </div>
                      <Typography variant="caption">{comment.timestamp}</Typography>
                    </div>
                    <Typography variant="body2">{comment.content}</Typography>
                    <div className="comment-actions">
                      <IconButton size="small">
                        <ThumbUp />
                      </IconButton>
                      <Typography variant="caption">{comment.likes}</Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" className="related-title">Related Videos</Typography>
          <div className="related-videos">
            {relatedVideos.map((video) => (
              <Card 
                key={video.id} 
                className="related-video-card"
                onClick={() => handleRelatedVideoClick(video.id)}
              >
                <img src={video.thumbnail} alt={video.title} />
                <CardContent>
                  <Typography variant="subtitle2">{video.title}</Typography>
                  <Typography variant="caption">
                    {video.views} views • {video.timestamp}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default VideoPage; 