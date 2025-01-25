import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './BuildCity.scss';

const buildings = [
  { type: 'Farm', emoji: '🌾', cost: 50 },
  { type: 'House', emoji: '🏠', cost: 100 },
  { type: 'Synagogue', emoji: '🕍', cost: 200 },
];

const BuildCity: React.FC = () => {
  const location = useLocation();
  const { level, xp, xpToNextLevel } = location.state || { level: 1, xp: 0, xpToNextLevel: 100 };

  interface Building {
    type: string;
    position: number[];
  }

  interface City {
    level: number;
    subLevel: number;
    xp: number;
    xpToNextLevel: number;
    buildings: Building[];
    grid: string[][];
  }

  const [city, setCity] = useState<City>({
    level,
    subLevel: 0,
    xp,
    xpToNextLevel,
    buildings: [],
    grid: Array(5).fill(null).map(() => Array(5).fill("⬜")),
  });

  const [message, setMessage] = useState('');

  const addBuilding = (building: { type: string; emoji: string; cost: number }) => {
    if (city.xp < building.cost) {
      setMessage(`Not enough XP to build ${building.type}`);
      return;
    }

    const newGrid = [...city.grid];
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (newGrid[i][j] === "⬜") {
          newGrid[i][j] = building.emoji;
          setCity({
            ...city,
            buildings: [...city.buildings, { type: building.type, position: [i, j] }],
            grid: newGrid,
            xp: city.xp - building.cost,
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
        <Typography variant="h4">Building Your City...</Typography>
        <Box className="city-container">
          {city.grid.map((row, i) =>
            row.map((cell, j) => (
              <Box
                key={`${i}-${j}`}
                className={`city-block ${cell !== "⬜" ? "filled" : ""}`}
                onClick={() => cell === "⬜" && addBuilding(buildings[0])} // Default to building a farm
              >
                {cell}
              </Box>
            ))
          )}
        </Box>
        <Box className="controls">
          {buildings.map((building) => (
            <Button
              key={building.type}
              variant="contained"
              color="primary"
              onClick={() => addBuilding(building)}
            >
              Build {building.type} ({building.cost} XP)
            </Button>
          ))}
        </Box>
        {message && <Typography variant="body2" color="error">{message}</Typography>}
      </Box>
    </div>
  );
};

export default BuildCity;