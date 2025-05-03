import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import './VideoChatContainer.scss';
import GameOption from '../GameOption';
import WaitingGame from '../WaitingGame';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { MessageCircle, Lightbulb, Users, Sparkles, Trophy } from 'lucide-react';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';

const conversationLevels = [
  {
    id: 1,
    name: "Casual Explorer",
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Discover new ideas through light, friendly conversation"
  },
  {
    id: 2,
    name: "Thoughtful Connector",
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Exchange ideas and learn from different personal perspectives"
  },
  {
    id: 3,
    name: "Opinion Engager",
    icon: <Users className="w-5 h-5" />,
    description: "Discuss varied opinions on societal and cultural topics"
  },
  {
    id: 4,
    name: "Policy Discusser",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Explore political viewpoints with nuanced understanding"
  },
  {
    id: 5,
    name: "Debate Master",
    icon: <Trophy className="w-5 h-5" />,
    description: "Engage in complex political discourse and challenging debates"
  }
];

const VideoChatContainer: React.FC = () => {
  const [startCall, setStartCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [gameOptionOpen, setGameOptionOpen] = useState<boolean>(false);
  const [playingGame, setPlayingGame] = useState<boolean>(false);
  const [selectedLevels, setSelectedLevels] = useState<number[]>([1]);
  const { toast } = useToast();

  return (
    <div className="video-chat-container">
      <div className="chat-header">
        <h2 className="chat-title">Start a Video Chat</h2>
        <Tabs defaultValue="chat" className="chat-tabs">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="game" onClick={() => setGameOptionOpen(true)}>
              Game
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="chat-content">
            <div className="levels-container">
              {conversationLevels.map((level) => (
                <div key={level.id} className="level-item">
                  <Checkbox
                    id={`level-${level.id}`}
                    checked={selectedLevels.includes(level.id)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setSelectedLevels([...selectedLevels, level.id]);
                      } else {
                        setSelectedLevels(selectedLevels.filter(id => id !== level.id));
                      }
                    }}
                  />
                  <Label htmlFor={`level-${level.id}`} className="level-label">
                    <div className="level-icon">
                      {level.icon}
                    </div>
                    <div className="level-info">
                      <h3 className="level-name">
                        {level.name}
                      </h3>
                      <p className="level-description">
                        {level.description}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
            <Button
              variant="default"
              onClick={() => {
                if (selectedLevels.length === 0) {
                  toast({
                    title: "Error",
                    description: "Please select at least one conversation level",
                    variant: "destructive"
                  });
                  return;
                }
                setStartCall(true);
              }}
              className="start-button"
              disabled={selectedLevels.length === 0}
            >
              Start Chat
            </Button>
          </TabsContent>
        </Tabs>
      </div>
      {startCall && !isConnecting && !playingGame && (
        <GameOption
          open={gameOptionOpen}
          onOpenChange={setGameOptionOpen}
          onGameStart={() => {
            setPlayingGame(true);
            setIsConnecting(true);
          }}
        />
      )}
      {isConnecting && (
        <WaitingGame
          onConnecting={setIsConnecting}
          onPlayingGame={setPlayingGame}
        />
      )}
    </div>
  );
};

export default VideoChatContainer;
