import React from 'react';
import { Box } from '@mui/material';
import './VideoFlowPage.scss';
import VideoChatContainer from '../../components/videoflow/VideoChat/VideoChatContainer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const VideoFlowPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Box className="video-flow-container">
        <VideoChatContainer />
      </Box>
    </QueryClientProvider>
  );
};

export default VideoFlowPage;
