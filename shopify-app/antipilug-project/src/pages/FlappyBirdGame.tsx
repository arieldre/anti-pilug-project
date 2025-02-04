import React, { useEffect, useRef, useState, useCallback } from 'react';
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
const FRAME_TIME = 1000 / 60;
const RESET_DELAY = 100;
const HIGH_SCORE_KEY = 'flappyHighScore';

// Cloud constants
const NUM_CLOUDS = 4;
const MIN_CLOUD_SIZE = 40;
const MAX_CLOUD_SIZE = 80;
const MIN_CLOUD_SPEED = 0.2;
const MAX_CLOUD_SPEED = 0.8;

// Visual effect constants
const FLASH_DURATION = 100;
const SCORE_POPUP_DURATION = 1000;

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface ScorePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  opacity: number;
}

const FlappyBirdGame: React.FC = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0');
  });
  const [level, setLevel] = useState(1);
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  
  // Refs
  const velocityRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const cloudIdRef = useRef(0);
  const lastBirdPosRef = useRef(GAME_HEIGHT / 2);
  const isResettingRef = useRef(false);
  const popupIdRef = useRef(0);

  const createCloud = useCallback(() => ({
    id: cloudIdRef.current++,
    x: GAME_WIDTH,
    y: Math.random() * (GAME_HEIGHT * 0.7),
    speed: MIN_CLOUD_SPEED + Math.random() * (MAX_CLOUD_SPEED - MIN_CLOUD_SPEED),
    size: MIN_CLOUD_SIZE + Math.random() * (MAX_CLOUD_SIZE - MIN_CLOUD_SIZE)
  }), []);

  const createPipe = useCallback((startX = GAME_WIDTH) => {
    const minHeight = 100;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    return { x: startX, height, passed: false };
  }, []);

  const addScorePopup = useCallback((value: number) => {
    const popup = {
      id: popupIdRef.current++,
      value,
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 3,
      opacity: 1
    };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, SCORE_POPUP_DURATION);
  }, []);

  const handleCollision = useCallback(() => {
    if (!gameOver) {
      setGameOver(true);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), FLASH_DURATION);
      
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    }
  }, [score, highScore]);

  const resetGame = useCallback(() => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }

    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBirdPos(GAME_HEIGHT / 2);
    setPipes([]);
    setClouds(Array(NUM_CLOUDS).fill(null).map(createCloud));
    setScorePopups([]);
    setIsPaused(false);
    setShowFlash(false);

    velocityRef.current = 0;
    lastTimeRef.current = 0;
    lastBirdPosRef.current = GAME_HEIGHT / 2;

    setTimeout(() => {
      isResettingRef.current = false;
    }, RESET_DELAY);
  }, [createCloud]);

  const handleJump = useCallback(() => {
    if (gameStarted && !gameOver && !isPaused) {
      velocityRef.current = JUMP_FORCE;
    }
  }, [gameStarted, gameOver, isPaused]);

  const handleClick = useCallback(() => {
    if (gameOver) {
      resetGame();
    } else if (!gameStarted) {
      setGameStarted(true);
      setPipes([createPipe(INITIAL_PIPE_DISTANCE)]);
    } else if (!isPaused) {
      handleJump();
    }
  }, [gameOver, gameStarted, isPaused, createPipe, handleJump, resetGame]);

  const handlePause = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Escape' && gameStarted && !gameOver) {
      setIsPaused(prev => !prev);
    }
  }, [gameStarted, gameOver]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!gameStarted || gameOver || isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = lastTimeRef.current ? 
      Math.min((timestamp - lastTimeRef.current) / FRAME_TIME, 2) : 1;
    lastTimeRef.current = timestamp;

    // Update bird physics
    velocityRef.current += GRAVITY * deltaTime;
    setBirdPos(prev => {
      const newPos = prev + velocityRef.current * deltaTime;
      lastBirdPosRef.current = prev;
      
      if (newPos < 0 || newPos > GAME_HEIGHT - BIRD_SIZE) {
        handleCollision();
        return prev;
      }
      return newPos;
    });

    // Update score popups
    setScorePopups(prev => 
      prev.map(popup => ({
        ...popup,
        y: popup.y - deltaTime,
        opacity: popup.opacity - deltaTime / SCORE_POPUP_DURATION
      }))
    );

    // Update clouds with parallax effect
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

    // Update pipes with immediate collision detection
    setPipes(prevPipes => {
      const pipeSpeed = (BASE_PIPE_SPEED + (level - 1) * 0.3) * deltaTime;
      const updatedPipes = prevPipes
        .map(pipe => ({
          ...pipe,
          x: pipe.x - pipeSpeed
        }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < GAME_WIDTH - 300) {
        updatedPipes.push(createPipe());
      }

      const birdLeft = 50 + 5;
      const birdRight = birdLeft + BIRD_SIZE - 10;
      const birdTop = birdPos + 5;
      const birdBottom = birdPos + BIRD_SIZE - 5;

      for (const pipe of updatedPipes) {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
          pipe.passed = true;
          addScorePopup(1);
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore % PIPES_PER_LEVEL === 0) {
              setLevel(l => l + 1);
            }
            return newScore;
          });
        }

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH &&
          (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP)
        ) {
          handleCollision();
          return updatedPipes;
        }
      }

      return updatedPipes;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, isPaused, birdPos, level, createCloud, createPipe, handleCollision, addScorePopup]);

  // Initialize game
  useEffect(() => {
    setClouds(Array(NUM_CLOUDS).fill(null).map(createCloud));
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [createCloud]);

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    window.addEventListener('keydown', handlePause);
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else if (!gameStarted) {
          setGameStarted(true);
          setPipes([createPipe(INITIAL_PIPE_DISTANCE)]);
        } else if (!isPaused) {
          handleJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handlePause);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, isPaused, createPipe, handleJump, resetGame, handlePause]);

  return (
    <Box className="flappy-bird-wrapper">
      <div 
        className={`game-container ${showFlash ? 'flash' : ''}`}
        onClick={handleClick}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
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
        
        {scorePopups.map(popup => (
          <div
            key={popup.id}
            className="score-popup"
            style={{
              left: popup.x,
              top: popup.y,
              opacity: popup.opacity
            }}
          >
            +{popup.value}
          </div>
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
        <div className="high-score">Best: {highScore}</div>
        <div className="level">Level: {level}</div>
        
        {isPaused && (
          <div className="pause-overlay">
            <div className="message">
              PAUSED<br/>Press ESC to Resume
            </div>
          </div>
        )}
        
        {!gameStarted && !gameOver && (
          <div className="message">
            Click to Start<br/>Press Space to Jump<br/>Press ESC to Pause
          </div>
        )}
        {gameOver && (
          <div className="message">
            Game Over!<br/>
            Score: {score}<br/>
            High Score: {highScore}<br/>
            Level: {level}<br/>
            Click to Restart
          </div>
        )}
      </div>
    </Box>
  );
};

export default FlappyBirdGame;