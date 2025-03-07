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

// Coin constants
const COIN_SIZE = 30;
const COIN_FREQUENCY = 200; // Higher number = less frequent (was 6)
const COIN_VALUE = 1; 

// Add after existing constants
const WEATHER_TYPES = ['sunny', 'rainy', 'snowy', 'foggy', 'windy', 'night'] as const;
type WeatherType = typeof WEATHER_TYPES[number];

// Add this after your other constants at the top of the file
// Weather-specific pipe colors
const PIPE_COLORS = {
  'sunny': '#4CAF50',  // Classic green
  'rainy': '#3498db',  // Blue
  'snowy': '#a8d5ff',  // Light blue
  'foggy': '#b8b8b8',  // Gray
  'windy': '#d2b48c',  // Tan/brown
  'night': '#1a1a3a',  // Dark blue
};

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

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  rotation: number;
}

// 1. Add this interface with your other interfaces at the top of the file:
interface Feather {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  color: string;
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
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinCount, setCoinCount] = useState(0);
  
  // Add to component state
  const [currentWeather, setCurrentWeather] = useState<WeatherType>('sunny');
  const [weatherParticles, setWeatherParticles] = useState<{id: number, x: number, y: number}[]>([]);
  const particleIdRef = useRef(0);
  
  // Fix 1: Add a reference to track when weather changes happened
  const lastWeatherChangeRef = useRef(0);
  
  // Refs
  const velocityRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const cloudIdRef = useRef(0);
  const lastBirdPosRef = useRef(GAME_HEIGHT / 2);
  const isResettingRef = useRef(false);
  const popupIdRef = useRef(0);
  const coinIdRef = useRef(0);

  // 2. Add feather state and ref with your other states:
  const [feathers, setFeathers] = useState<Feather[]>([]);
  const featherIdRef = useRef(0);

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

  const createCoin = useCallback(() => {
    const minY = 80;
    const maxY = GAME_HEIGHT - 80;
    const safeBuffer = 40; // Buffer distance from pipes
    
    // Generate a random Y position
    let y = Math.random() * (maxY - minY) + minY;
    
    // Check against existing pipes to ensure the coin is reachable
    let isValidPosition = false;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    while (!isValidPosition && attempts < maxAttempts) {
      attempts++;
      isValidPosition = true;
      
      // Check against all existing pipes
      for (const pipe of pipes) {
        // Calculate where the pipe will be when the coin reaches the bird
        const pipePositionWhenCoinReaches = pipe.x - BASE_PIPE_SPEED * ((GAME_WIDTH - 50) / BASE_PIPE_SPEED);
        
        // Only check pipes that will be in range
        if (pipePositionWhenCoinReaches < -PIPE_WIDTH) {
          continue; // Pipe will be gone when coin reaches the bird
        }
        
        // Check if the coin's Y position conflicts with pipe + buffer
        if (
          (y < pipe.height + safeBuffer) || // Too close to top pipe
          (y > pipe.height + PIPE_GAP - safeBuffer - COIN_SIZE) // Too close to bottom pipe
        ) {
          // Position conflicts with this pipe, try a new position
          isValidPosition = false;
          y = Math.random() * (maxY - minY) + minY;
          break;
        }
      }
    }
    
    // If we still don't have a valid position after max attempts,
    // place the coin in the middle of the gap of the furthest pipe
    if (!isValidPosition && pipes.length > 0) {
      const lastPipe = pipes[pipes.length - 1];
      y = lastPipe.height + PIPE_GAP / 2 - COIN_SIZE / 2;
    }
    
    return {
      id: coinIdRef.current++,
      x: GAME_WIDTH,
      y: y,
      collected: false,
      rotation: 0
    };
  }, [pipes]);

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
    setCoins([]);
    setCoinCount(0);

    velocityRef.current = 0;
    lastTimeRef.current = 0;
    lastBirdPosRef.current = GAME_HEIGHT / 2;

    // Fix 3: In resetGame, add this:
    lastWeatherChangeRef.current = 0;
    setCurrentWeather('sunny');
    setWeatherParticles([]);

    // 6. Add this to resetGame function:
    setFeathers([]);

    setTimeout(() => {
      isResettingRef.current = false;
    }, RESET_DELAY);
  }, [createCloud]);

  // 3. Add this function with your other creation functions:
  const createFeathers = useCallback(() => {
    const newFeathers: Feather[] = [];
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 feathers
    
    const featherColors = ['#FFD700', '#FFA500', '#FF8C00'];
    
    for (let i = 0; i < count; i++) {
      newFeathers.push({
        id: featherIdRef.current++,
        x: 60,  // Just after bird position
        y: birdPos + 20,
        rotation: Math.random() * 360,
        size: 4 + Math.random() * 7,
        opacity: 1,
        // Change to negative values for backward movement
        velocityX: -2 - Math.random() * 5, // Negative values (was positive)
        velocityY: -3 + Math.random() * 6, 
        rotationSpeed: -8 + Math.random() * 16,
        color: featherColors[Math.floor(Math.random() * featherColors.length)]
      });
    }
    
    setFeathers(prev => [...prev, ...newFeathers]);
  }, [birdPos]);

  // 4. Update your handleJump function:
  const handleJump = useCallback(() => {
    if (gameStarted && !gameOver && !isPaused) {
      velocityRef.current = JUMP_FORCE;
      if (Math.random() < 0.4) createFeathers(); // 40% chance (was 30%)
    }
  }, [gameStarted, gameOver, isPaused, createFeathers]);

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

  // Add before gameLoop function
  const updateWeatherParticles = useCallback((deltaTime: number) => {
    if (!gameStarted || isPaused) return;
  
    setWeatherParticles(prev => {
      let updated = [...prev];
      
      // Remove particles that are out of bounds
      updated = updated.filter(particle => 
        particle.y < GAME_HEIGHT && particle.x > -10
      );
      
      // Add new particles based on weather
      if (currentWeather === 'rainy' && updated.length < 80) {
        for (let i = 0; i < 3; i++) {
          updated.push({
            id: particleIdRef.current++,
            x: Math.random() * GAME_WIDTH,
            y: -10
          });
        }
      } else if (currentWeather === 'snowy' && updated.length < 60) {
        for (let i = 0; i < 2; i++) {
          updated.push({
            id: particleIdRef.current++,
            x: Math.random() * GAME_WIDTH,
            y: -10
          });
        }
      } else if (currentWeather === 'foggy' && updated.length < 20) {
        updated.push({
          id: particleIdRef.current++,
          x: GAME_WIDTH,
          y: Math.random() * GAME_HEIGHT * 0.8
        });
      } else if (currentWeather === 'windy' && updated.length < 40) {
        updated.push({
          id: particleIdRef.current++,
          x: GAME_WIDTH + 5,
          y: Math.random() * GAME_HEIGHT
        });
      }
      
      // Move particles
      return updated.map(particle => {
        let dx = 0, dy = 0;
        
        if (currentWeather === 'rainy') {
          dx = -2 * deltaTime;
          dy = 10 * deltaTime;
        } else if (currentWeather === 'snowy') {
          dx = Math.sin(Date.now() / 1000 + particle.id) * deltaTime;
          dy = 1.5 * deltaTime;
        } else if (currentWeather === 'foggy') {
          dx = -1.5 * deltaTime;
          dy = 0;
        } else if (currentWeather === 'windy') {
          dx = -8 * deltaTime;
          dy = Math.sin(Date.now() / 300 + particle.id) * deltaTime;
        }
        
        return {
          ...particle,
          x: particle.x + dx,
          y: particle.y + dy
        };
      });
    });
  }, [currentWeather, gameStarted, isPaused]);

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

    // Update coins
    setCoins(prevCoins => {
      const pipeSpeed = (BASE_PIPE_SPEED + (level - 1) * 0.3) * deltaTime;
      let updatedCoins = prevCoins
        .map(coin => ({
          ...coin,
          x: coin.x - pipeSpeed,
          rotation: (coin.rotation + 2 * deltaTime) % 360
        }))
        .filter(coin => coin.x > -COIN_SIZE);

      // Maybe add a new coin
      if (
        (prevCoins.length === 0 || prevCoins[prevCoins.length - 1].x < GAME_WIDTH - 200) && 
        Math.random() < 1/COIN_FREQUENCY // CHANGE FROM > TO <
      ) {
        updatedCoins.push(createCoin());
      }

      // Check for coin collection
      const birdCenterX = 50 + BIRD_SIZE / 2;
      const birdCenterY = birdPos + BIRD_SIZE / 2;
      
      updatedCoins = updatedCoins.map(coin => {
        if (!coin.collected) {
          const coinCenterX = coin.x + COIN_SIZE / 2;
          const coinCenterY = coin.y + COIN_SIZE / 2;
          const distance = Math.sqrt(
            Math.pow(birdCenterX - coinCenterX, 2) + 
            Math.pow(birdCenterY - coinCenterY, 2)
          );
          
          if (distance < (BIRD_SIZE + COIN_SIZE) / 2 - 5) {
            // Collect the coin
            addScorePopup(COIN_VALUE);
            setCoinCount(prev => prev + 1);
            setScore(prev => prev + COIN_VALUE);
            return { ...coin, collected: true };
          }
        }
        return coin;
      });

      return updatedCoins;
    });

    // Add this line in your gameLoop function after updating coins but before updating pipes
    updateWeatherParticles(deltaTime);

    // 5. Add this inside your gameLoop before the pipes update:
    // Update feathers
    setFeathers(prev => {
      return prev
        .map(feather => ({
          ...feather,
          x: feather.x + feather.velocityX * deltaTime,
          y: feather.y + feather.velocityY * deltaTime,
          rotation: feather.rotation + 5 * deltaTime,
          velocityY: feather.velocityY + 0.1 * deltaTime,
          opacity: feather.opacity - 0.01 * deltaTime
        }))
        .filter(feather => feather.opacity > 0);
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
  }, [gameStarted, gameOver, isPaused, birdPos, level, createCloud, createPipe, handleCollision, addScorePopup, updateWeatherParticles]);

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

  // Fix 2: Replace your weather change effect with this improved version
  useEffect(() => {
    // Only change weather when crossing 15-point thresholds
    const currentThreshold = Math.floor(score / 15);
    
    if (score > 0 && currentThreshold > lastWeatherChangeRef.current) {
      // Update the reference so we don't trigger multiple times
      lastWeatherChangeRef.current = currentThreshold;
      
      // Calculate weather index (0=sunny, 1=rainy, etc)
      const weatherIndex = currentThreshold % WEATHER_TYPES.length;
      console.log(`Weather changing to: ${WEATHER_TYPES[weatherIndex]} at score: ${score}`);
      
      // Set the weather
      setCurrentWeather(WEATHER_TYPES[weatherIndex]);
    }
  }, [score]);

  return (
    <Box className="flappy-bird-wrapper">
      <div 
        className={`game-container ${currentWeather} ${showFlash ? 'flash' : ''}`}
        onClick={handleClick}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Weather particles */}
        {weatherParticles.map(particle => (
          <div
            key={particle.id}
            className={`weather-particle ${currentWeather}`}
            style={{
              left: particle.x,
              top: particle.y
            }}
          />
        ))}

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
          {/* Fixed hat positioning - centered on top of head */}
          <div 
            className="hat"
            style={{
              position: 'absolute',
              width: '16px',
              height: '18px',
              backgroundColor: '#4CAF50',
              top: '-15px', // Move up slightly
              left: '12px', // Keep horizontal position
              transform: 'rotate(0deg)', // Make it straight (was -15deg)
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              zIndex: 4
            }}
          />
          <div className="eye" />
          <div className="beak" />
          <div className="cheek" />
        </div>

        {/* 7. Add this to your JSX right after the bird component: */}
        {feathers.map(feather => (
          <div
            key={feather.id}
            className="feather"
            style={{
              left: feather.x,
              top: feather.y,
              width: feather.size,
              height: feather.size * 1.5,
              opacity: feather.opacity,
              transform: `rotate(${feather.rotation}deg)`,
              backgroundColor: feather.color
            }}
          />
        ))}
        
        {pipes.map((pipe, index) => {
          const pipeColor = PIPE_COLORS[currentWeather] || '#4CAF50';
          const pipeBorderColor = currentWeather === 'night' ? '#0a0a20' : 
                                   currentWeather === 'snowy' ? '#7baee0' : 
                                   '#006400'; // Default cap color
          
          return (
            <div key={index} className={`pipes weather-${currentWeather}`} style={{ zIndex: 2 }}>
              <div 
                className="pipe top" 
                style={{ 
                  left: pipe.x, 
                  height: pipe.height,
                  backgroundColor: pipeColor,
                  '--pipe-cap-color': pipeBorderColor
                } as React.CSSProperties} 
              />
              <div 
                className="pipe bottom" 
                style={{ 
                  left: pipe.x, 
                  height: GAME_HEIGHT - pipe.height - PIPE_GAP,
                  top: pipe.height + PIPE_GAP,
                  backgroundColor: pipeColor,
                  '--pipe-cap-color': pipeBorderColor
                } as React.CSSProperties} 
              />
            </div>
          );
        })}

        {coins.map(coin => (
          <div
            key={coin.id}
            className={`coin ${coin.collected ? 'collected' : ''}`}
            style={{
              left: coin.x,
              top: coin.y,
              width: COIN_SIZE,
              height: COIN_SIZE,
              transform: `rotate(${coin.rotation}deg)`,
              zIndex: 2
            }}
          />
        ))}

        <div className="score">Score: {score}</div>
        <div className="high-score">Best: {highScore}</div>
        <div className="level">Level: {level}</div>
        <div className="weather-indicator">{currentWeather}</div>
        
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