import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import './FlappyBirdGame.scss';

// Game constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const BASE_PIPE_SPEED = 3;
const PIPES_PER_LEVEL = 5;
const INITIAL_PIPE_DISTANCE = GAME_WIDTH + 100;

// Cloud constants
const NUM_CLOUDS = 4;
const MIN_CLOUD_SIZE = 40;
const MAX_CLOUD_SIZE = 80;
const MIN_CLOUD_SPEED = 0.2;
const MAX_CLOUD_SPEED = 0.8;

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

interface Cloud {
  id: number;  // Added id for better key management
  x: number;
  y: number;
  speed: number;
  size: number;
}

const FlappyBirdGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  
  const velocityRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const cloudIdRef = useRef(0);
  const lastBirdPosRef = useRef(GAME_HEIGHT / 2);

  const createCloud = () => ({
    id: cloudIdRef.current++,
    x: GAME_WIDTH,
    y: Math.random() * (GAME_HEIGHT * 0.7),
    speed: MIN_CLOUD_SPEED + Math.random() * (MAX_CLOUD_SPEED - MIN_CLOUD_SPEED),
    size: MIN_CLOUD_SIZE + Math.random() * (MAX_CLOUD_SIZE - MIN_CLOUD_SIZE)
  });

  const createPipe = (startX = GAME_WIDTH) => {
    const minHeight = 100;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    return { x: startX, height, passed: false };
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBirdPos(GAME_HEIGHT / 2);
    setPipes([]);
    setClouds(Array(NUM_CLOUDS).fill(null).map(createCloud));
    velocityRef.current = 0;
    lastTimeRef.current = 0;
    lastBirdPosRef.current = GAME_HEIGHT / 2;
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
      setPipes([createPipe(INITIAL_PIPE_DISTANCE)]);
    } else {
      handleJump();
    }
  };

  // Initialize clouds
  useEffect(() => {
    setClouds(Array(NUM_CLOUDS).fill(null).map(createCloud));
  }, []);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!gameStarted || gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 16.666 : 1;
      lastTimeRef.current = timestamp;

      // Bird physics
      if (!gameOver) {
        velocityRef.current += GRAVITY * deltaTime;
        setBirdPos(prev => {
          const newPos = prev + velocityRef.current * deltaTime;
          lastBirdPosRef.current = newPos;
          if (newPos < 0 || newPos > GAME_HEIGHT - BIRD_SIZE) {
            setGameOver(true);
            return prev;
          }
          return newPos;
        });
      }

      // Cloud movement
      setClouds(prevClouds => {
        const updatedClouds = prevClouds
          .map(cloud => ({
            ...cloud,
            x: cloud.x - cloud.speed * deltaTime
          }))
          .filter(cloud => cloud.x > -cloud.size);

        while (updatedClouds.length < NUM_CLOUDS) {
          updatedClouds.push(createCloud());
        }

        return updatedClouds;
      });

      // Pipe movement
      setPipes(prevPipes => {
        const pipeSpeed = (BASE_PIPE_SPEED + (level - 1) * 0.3) * deltaTime;
        const updatedPipes = prevPipes
          .map(pipe => ({
            ...pipe,
            x: pipe.x - pipeSpeed
          }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        if (!gameOver) {
          if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < GAME_WIDTH - 300) {
            updatedPipes.push(createPipe());
          }

          for (const pipe of updatedPipes) {
            if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
              pipe.passed = true;
              setScore(prev => {
                const newScore = prev + 1;
                if (newScore % PIPES_PER_LEVEL === 0) {
                  setLevel(l => l + 1);
                }
                return newScore;
              });
            }

            const birdLeft = 50 + 5;
            const birdRight = birdLeft + BIRD_SIZE - 10;
            const birdTop = birdPos + 5;
            const birdBottom = birdPos + BIRD_SIZE - 5;

            if (
              birdRight > pipe.x &&
              birdLeft < pipe.x + PIPE_WIDTH &&
              (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP)
            ) {
              setGameOver(true);
              break;
            }
          }
        }

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
        if (!gameStarted) {
          handleClick();
        } else if (!gameOver) {
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
        {/* Render clouds with lower z-index */}
        {clouds.map(cloud => (
          <div
            key={cloud.id}
            className="cloud"
            style={{
              left: cloud.x,
              top: cloud.y,
              width: cloud.size,
              height: cloud.size * 0.6,
              zIndex: 1
            }}
          />
        ))}
        
        <div 
          className="bird" 
          style={{ 
            top: gameOver ? lastBirdPosRef.current : birdPos,
            transform: `rotate(${Math.min(Math.max(velocityRef.current * 3, -30), 30)}deg)`,
            zIndex: 3
          }}
        >
          <div className="eye" />
          <div className="beak" />
        </div>
        
        {pipes.map((pipe, index) => (
          <div key={index} className="pipes" style={{ zIndex: 2 }}>
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