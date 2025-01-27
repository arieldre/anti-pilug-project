import React, { useState, useEffect } from "react";
import { Typography, Box, Button, Tooltip } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./BuildCity.scss";

const buildings = [
  { type: "Farm", emoji: "🌾", cost: 2, population: 1, upgrade: { type: "Computer Farm", emoji: "🤖", cost: 4, population: 2 } },
  { type: "Market", emoji: "🛒", cost: 5, population: 3, upgrade: { type: "Supermarket", emoji: "🏬", cost: 7, population: 5 } },
  { type: "House", emoji: "🏠", cost: 4, population: 4, upgrade: { type: "Villa", emoji: "🏡", cost: 6, population: 6 } },
  { type: "Townhall", emoji: "🏛️", cost: 7, population: 5, upgrade: { type: "Capitol", emoji: "🏤", cost: 9, population: 7 } },
  { type: "Synagogue", emoji: "🕍", cost: 8, population: 6, upgrade: { type: "Temple", emoji: "⛪", cost: 10, population: 8 } },
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

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState("");
  const [population, setPopulation] = useState(0);
  const [progress, setProgress] = useState(0);

  // Function to calculate total population from buildings
  const calculatePopulation = () =>
    city.buildings.reduce((acc, b) => acc + b.population, 0);

  // Add population every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPopulation((prev) => prev + calculatePopulation());
      setProgress(0);
    }, 30000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 3.33 : 100)); // Increase progress bar
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [city.buildings]);

  const placeBuilding = (building: { type: string; emoji: string; cost: number; population: number }) => {
    if (!selectedCell) {
      setMessage("Please select a cell before placing a building.");
      return;
    }

    const [row, col] = selectedCell;
    if (city.grid[row][col] !== "⬜") {
      setMessage("The selected cell is already occupied.");
      return;
    }

    if (city.points < building.cost) {
      setMessage(`Not enough points to build ${building.type}`);
      return;
    }

    const newGrid = [...city.grid];
    newGrid[row][col] = building.emoji;

    setCity({
      ...city,
      grid: newGrid,
      points: city.points - building.cost,
      buildings: [...city.buildings, { type: building.type, position: [row, col], population: building.population }],
    });

    setSelectedCell(null); // Reset the selected cell
    setMessage("");
  };

  const upgradeBuilding = () => {
    if (!selectedCell) {
      setMessage("Please select a cell before upgrading.");
      return;
    }

    const [row, col] = selectedCell;
    const currentEmoji = city.grid[row][col];
    const building = buildings.find((b) => b.emoji === currentEmoji);

    if (!building || !building.upgrade) {
      setMessage("This building cannot be upgraded.");
      return;
    }

    if (city.grid[row][col] === building.upgrade.emoji) {
      setMessage("This building is already upgraded.");
      return;
    }

    if (city.points < building.upgrade.cost) {
      setMessage(`Not enough points to upgrade to ${building.upgrade.type}`);
      return;
    }

    const newGrid = [...city.grid];
    newGrid[row][col] = building.upgrade.emoji;

    const newBuildings = city.buildings.map((b) => {
      if (b.position[0] === row && b.position[1] === col) {
        return { ...b, type: building.upgrade.type, population: building.upgrade.population };
      }
      return b;
    });

    setCity({
      ...city,
      grid: newGrid,
      points: city.points - building.upgrade.cost,
      buildings: newBuildings,
    });

    // Trigger animation
    const updatedCell = document.querySelector(
      `.city-block[data-row="${row}"][data-col="${col}"]`
    );
    if (updatedCell) updatedCell.classList.add("upgraded");
    setTimeout(() => updatedCell?.classList.remove("upgraded"), 500);

    setSelectedCell(null);
    setMessage("");
  };

  const totalPopulation = population + calculatePopulation();

  return (
    <div className="build-city">
      <Box className="city-animation">
        {/* Points and Population Display */}
        <Box className="points-display">
          <Typography variant="h6">Current Points: {city.points}</Typography>
          <Typography variant="h6">Estimated Population: {totalPopulation}</Typography>
        </Box>

        {/* Timer Progress Bar */}
        <Box className="timer-line">
          <Box className="timer-progress" style={{ width: `${progress}%` }}></Box>
        </Box>

        {/* Controls */}
        <Box className="controls">
          {buildings
            .sort((a, b) => a.cost - b.cost) // Sort buttons by cost
            .map((building) => (
              <Tooltip
                key={building.type}
                title={`Cost: ${building.cost} | Population: +${building.population}`}
                arrow
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={city.points < building.cost}
                  onClick={() => placeBuilding(building)}
                >
                  Build {building.type} ({building.cost} points)
                </Button>
              </Tooltip>
            ))}
        </Box>

        {/* Error/Info Message */}
        {message && <Typography variant="body2" color="error">{message}</Typography>}

        {/* Selected Cell Details */}
        {selectedCell && city.grid[selectedCell[0]][selectedCell[1]] !== "⬜" && (
          <Button
            className="upgrade-button"
            onClick={upgradeBuilding}
            disabled={
              city.points <
              buildings.find((b) => b.emoji === city.grid[selectedCell[0]][selectedCell[1]])?.upgrade?.cost
            }
          >
            Upgrade (
            {buildings.find((b) => b.emoji === city.grid[selectedCell[0]][selectedCell[1]])?.upgrade?.cost || 0}{" "}
            points)
          </Button>
        )}

        {/* City Grid */}
        <Box className="city-container">
          {city.grid.map((row, i) =>
            row.map((cell, j) => (
              <Box
                key={`${i}-${j}`}
                data-row={i}
                data-col={j}
                className={`city-block ${cell !== "⬜" ? "filled" : ""} ${
                  selectedCell?.[0] === i && selectedCell?.[1] === j ? "selected" : ""
                }`}
                onClick={() => setSelectedCell([i, j])} // Set the selected cell
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
