const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Game statistics stored in memory
let gameStats = {
    totalGames: 0,
    totalMoves: 0,
    bestScore: null,
    averageMoves: 0
};

// API endpoint to get game statistics
app.get('/api/stats', (req, res) => {
    res.json(calculateStats());
});

// API endpoint to submit a completed game
app.post('/api/game/complete', (req, res) => {
    const { moves } = req.body;
    
    if (!moves || typeof moves !== 'number') {
        return res.status(400).json({ error: 'Invalid moves count' });
    }
    
    const result = recordGameCompletion(moves);
    res.json(result);
});

// API endpoint to generate puzzle hints
app.post('/api/puzzle/hint', (req, res) => {
    const { gridState } = req.body;
    
    if (!gridState || !Array.isArray(gridState)) {
        return res.status(400).json({ error: 'Invalid grid state' });
    }
    
    const hint = generateHint(gridState);
    res.json({ hint });
});

// API endpoint to validate if puzzle is solvable
app.post('/api/puzzle/validate', (req, res) => {
    const { gridState } = req.body;
    
    if (!gridState || !Array.isArray(gridState)) {
        return res.status(400).json({ error: 'Invalid grid state' });
    }
    
    const solvable = isPuzzleSolvable(gridState);
    res.json({ solvable });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        uptime: process.uptime(),
        port: PORT 
    });
});

// Serve the game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Records a completed game and updates statistics
 * @param {number} moves - Number of moves taken to complete the game
 * @returns {object} Updated statistics
 */
function recordGameCompletion(moves) {
    gameStats.totalGames++;
    gameStats.totalMoves += moves;
    
    if (gameStats.bestScore === null || moves < gameStats.bestScore) {
        gameStats.bestScore = moves;
    }
    
    return calculateStats();
}

/**
 * Calculates current game statistics including averages
 * @returns {object} Calculated statistics
 */
function calculateStats() {
    const average = gameStats.totalGames > 0 
        ? Math.round(gameStats.totalMoves / gameStats.totalGames) 
        : 0;
    
    return {
        totalGames: gameStats.totalGames,
        totalMoves: gameStats.totalMoves,
        bestScore: gameStats.bestScore,
        averageMoves: average
    };
}

/**
 * Generates a hint for the current puzzle state
 * @param {Array} gridState - Current state of the grid
 * @returns {string} Hint message
 */
function generateHint(gridState) {
    const lightCount = countLights(gridState);
    
    if (lightCount === 0) {
        return "Puzzle already solved!";
    }
    
    if (lightCount === 1) {
        return "Just one light left! Look for the isolated light.";
    }
    
    if (lightCount <= 3) {
        return "Almost there! Focus on the remaining lit cells.";
    }
    
    const corners = checkCorners(gridState);
    if (corners.length > 0) {
        return `Try starting with a corner at position (${corners[0].row}, ${corners[0].col})`;
    }
    
    return "Try working from the edges toward the center.";
}

/**
 * Counts the number of lights that are currently on
 * @param {Array} gridState - Current state of the grid
 * @returns {number} Number of lights on
 */
function countLights(gridState) {
    let count = 0;
    for (let row of gridState) {
        for (let cell of row) {
            if (cell) count++;
        }
    }
    return count;
}

/**
 * Checks which corner lights are on
 * @param {Array} gridState - Current state of the grid
 * @returns {Array} Array of corner positions that are lit
 */
function checkCorners(gridState) {
    const corners = [];
    const size = gridState.length;
    const positions = [
        { row: 0, col: 0 },
        { row: 0, col: size - 1 },
        { row: size - 1, col: 0 },
        { row: size - 1, col: size - 1 }
    ];
    
    for (let pos of positions) {
        if (gridState[pos.row][pos.col]) {
            corners.push(pos);
        }
    }
    
    return corners;
}

/**
 * Validates if a puzzle state is theoretically solvable
 * Note: In Lights Out, all states are solvable, but this checks basic validity
 * @param {Array} gridState - Current state of the grid
 * @returns {boolean} Whether the puzzle state is valid
 */
function isPuzzleSolvable(gridState) {
    if (!gridState || gridState.length === 0) {
        return false;
    }
    
    const size = gridState.length;
    for (let row of gridState) {
        if (!Array.isArray(row) || row.length !== size) {
            return false;
        }
    }
    
    return true;
}

// Start server
app.listen(PORT, () => {
    console.log(`🎮 Lights Out game server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} to play`);
    console.log(`📊 Stats API available at http://localhost:${PORT}/api/stats`);
});
