import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import './FlappyBirdGame.scss';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.4;
const JUMP_FORCE = -8;
const PIPE_SPEED = 3;

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

const FlappyBirdGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  
  const velocityRef = useRef(0);
  const gameLoopRef = useRef<number>();

  const createPipe = () => {
    const height = Math.random() * (GAME_HEIGHT - PIPE_GAP - 150) + 100;
    return { x: GAME_WIDTH, height, passed: false };
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBirdPos(GAME_HEIGHT / 2);
    setPipes([]);
    velocityRef.current = 0;
  };

  const handleJump = () => {
    if (gameStarted && !gameOver) {
      velocityRef.current = JUMP_FORCE;
    }
  };

  const handleClick = () => {
    if (gameOver) {
      resetGame();
    } else if (!gameStarted) {
      setGameStarted(true);
      setPipes([createPipe()]);
    } else {
      handleJump();
    }
  };

  useEffect(() => {
    const gameLoop = () => {
      if (!gameStarted || gameOver) return;

      velocityRef.current += GRAVITY;
      setBirdPos(prev => {
        const newPos = prev + velocityRef.current;
        if (newPos < 0 || newPos > GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          return prev;
        }
        return newPos;
      });

      setPipes(prevPipes => {
        const updatedPipes = prevPipes
          .map(pipe => ({
            ...pipe,
            x: pipe.x - (PIPE_SPEED + level * 0.5)
          }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        if (prevPipes[prevPipes.length - 1]?.x < GAME_WIDTH - 300) {
          updatedPipes.push(createPipe());
        }

        updatedPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
            pipe.passed = true;
            setScore(prev => prev + 1);
            setLevel(prev => prev + 1);
          }

          if (
            pipe.x < BIRD_SIZE + 50 &&
            pipe.x + PIPE_WIDTH > 50 &&
            (birdPos < pipe.height || birdPos + BIRD_SIZE > pipe.height + PIPE_GAP)
          ) {
            setGameOver(true);
          }
        });

        return updatedPipes;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, birdPos, level]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameStarted && !gameOver) {
          handleJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  return (
    <Box className="flappy-bird-wrapper">
      <div 
        className="game-container" 
        onClick={handleClick}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        <div className="bird" style={{ top: birdPos }}>
          <div className="eye" />
          <div className="beak" />
        </div>
        
        {pipes.map((pipe, index) => (
          <div key={index} className="pipes">
            <div 
              className="pipe top" 
              style={{ left: pipe.x, height: pipe.height }} 
            />
            <div 
              className="pipe bottom" 
              style={{ 
                left: pipe.x, 
                height: GAME_HEIGHT - pipe.height - PIPE_GAP,
                top: pipe.height + PIPE_GAP 
              }} 
            />
          </div>
        ))}

        <div className="score">Score: {score}</div>
        <div className="level">Level: {level}</div>
        
        {!gameStarted && (
          <div className="message">
            Click to Start<br/>Press Space to Jump
          </div>
        )}
        {gameOver && (
          <div className="message">
            Game Over!<br/>
            Score: {score}<br/>
            Level: {level}<br/>
            Click to Restart
          </div>
        )}
      </div>
    </Box>
  );
};

export default FlappyBirdGame;