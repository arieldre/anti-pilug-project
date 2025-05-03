import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface GameOptionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameStart?: () => void;
}

const GameOption: React.FC<GameOptionProps> = ({ open, onOpenChange, onGameStart }) => {
  const { toast } = useToast();

  const handleGameSelection = (gameType: string) => {
    toast({
      title: `Selected ${gameType} game`,
      description: `You will be matched with a partner for ${gameType} game`,
    });
    onOpenChange(false);
    if (onGameStart) {
      onGameStart();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a Game</DialogTitle>
        </DialogHeader>
        <div className="game-options">
          <Button
            onClick={() => handleGameSelection('Memory')}
            className="game-button"
          >
            Memory Game
          </Button>
          <Button
            onClick={() => handleGameSelection('Quiz')}
            className="game-button"
          >
            Quiz Game
          </Button>
          <Button
            onClick={() => handleGameSelection('Pictionary')}
            className="game-button"
          >
            Pictionary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOption;
