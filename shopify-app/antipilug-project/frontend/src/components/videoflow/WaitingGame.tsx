import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface WaitingGameProps {
  onConnecting: (connecting: boolean) => void;
  onPlayingGame: (playing: boolean) => void;
}

const WaitingGame: React.FC<WaitingGameProps> = ({ onConnecting, onPlayingGame }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnected = () => {
    onConnecting(false);
    onPlayingGame(true);
    toast({
      title: "Connected Successfully",
      description: "You are now connected with your partner",
    });
  };

  return (
    <Box className="waiting-container">
      <Box className="waiting-content">
        <CircularProgress size={40} />
        <Typography variant="h5" className="waiting-title">
          Waiting for connection...
        </Typography>
        <Typography variant="body1" className="waiting-description">
          We're finding the best match for you. This may take a few moments.
        </Typography>
        <Button
          onClick={handleConnected}
          className="connect-button"
        >
          Connect
        </Button>
      </Box>
    </Box>
  );
};

export default WaitingGame;
