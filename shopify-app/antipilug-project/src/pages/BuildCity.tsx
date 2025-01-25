import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './BuildCity.scss';

// Updated building list
const buildings = [
  { type: 'Farm', emoji: '🌾', cost: 2 },
  { type: 'Market', emoji: '🛒', cost: 5 },
  { type: 'House', emoji: '🏠', cost: 4 },
  { type: 'Townhall', emoji: '🏛️', cost: 7 },
  { type: 'Synagogue', emoji: '🕍', cost: 8 },
];

const BuildCity: React.FC = () => {
  const location = useLocation();
  const { level, points } = location.state || { level: 1, points: 0 };

  const [city, setCity] = useState({
    level,
    points: Math.floor(points / 10), // Divide current points by 10
    buildings: [],
    grid: Array(9) // 9 rows
      .fill(null)
      .map(() => Array(10).fill("⬜")), // 10 columns
  });

  const [message, setMessage] = useState('');

  // Function to handle adding buildings
  const addBuilding = (building: { type: string; emoji: string; cost: number }) => {
    if (city.points < building.cost) {
      setMessage(`Not enough points to build ${building.type}`);
      return;
    }

    const newGrid = [...city.grid];
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (newGrid[i][j] === "⬜") {
          newGrid[i][j] = building.emoji;
          setCity({
            ...city,
            grid: newGrid,
            points: city.points - building.cost,
          });
          setMessage('');
          return;
        }
      }
    }
    setMessage('No empty space to build');
  };

  return (
    <div className="build-city">
      <Box className="city-animation">
        {/* Points Display */}
        <Typography variant="h6" className="points-display">
          Current Points: {city.points}
        </Typography>

        {/* Controls */}
        <Box className="controls">
          {buildings
            .sort((a, b) => a.cost - b.cost) // Sort buttons by cost
            .map((building) => (
              <Button
                key={building.type}
                variant="contained"
                color="primary"
                onClick={() => addBuilding(building)}
              >
                Build {building.type} ({building.cost} points)
              </Button>
            ))}
        </Box>

        {/* Error/Info Message */}
        {message && <Typography variant="body2" color="error">{message}</Typography>}

        {/* City Grid */}
        <Box className="city-container">
          {city.grid.map((row, i) =>
            row.map((cell, j) => (
              <Box
                key={`${i}-${j}`}
                className={`city-block ${cell !== "⬜" ? "filled" : ""}`}
              >
                {cell}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </div>
  );
};

export default BuildCity;
