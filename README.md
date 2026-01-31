# Lights Out Game

A zen-style Lights Out puzzle game built with Express.js, featuring server-side game statistics and hint generation.

## Features

- **Classic Lights Out gameplay** - Click lights to toggle them and their neighbors
- **Server-side statistics** - Track total games, best score, and average moves
- **Hint system** - Get strategic hints from the server
- **API endpoints** for game management
- **Configurable port** via environment variable
- **Persistent local storage** for personal best scores

## JavaScript Functions & APIs

### Server Functions (`server.js`)

- `recordGameCompletion(moves)` - Records completed games and updates statistics
- `calculateStats()` - Calculates game statistics including averages
- `generateHint(gridState)` - Provides strategic hints based on current puzzle state
- `countLights(gridState)` - Counts active lights in the grid
- `checkCorners(gridState)` - Identifies which corner lights are active
- `isPuzzleSolvable(gridState)` - Validates puzzle state

### Client Functions (`public/index.html`)

- `fetchStats()` - Retrieves game statistics from server
- `submitGameCompletion(moveCount)` - Submits completed game to server
- `getHint()` - Requests puzzle hint from server

### API Endpoints

- `GET /api/stats` - Get game statistics
- `POST /api/game/complete` - Submit a completed game
- `POST /api/puzzle/hint` - Get a hint for current puzzle
- `POST /api/puzzle/validate` - Validate puzzle state
- `GET /health` - Health check endpoint

## Installation

```bash
npm install
```

## Running Locally

```bash
npm start
```

The game will run on `http://localhost:3000` by default.

## Port Configuration

Set custom port via environment variable:

```bash
PORT=8080 npm start
```

## Deployment

This application is designed to be deployed on any platform that supports Node.js:

### Environment Variables

- `PORT` - Server port (default: 3000)

### Example: Generic Deployment

1. Ensure `package.json` has start script
2. Set `PORT` environment variable on your platform
3. Deploy and access via your platform's URL

The server automatically uses `process.env.PORT` making it compatible with most deployment platforms.

## How to Play

1. Click any light to toggle it and its 4 adjacent neighbors
2. Turn all lights off to win
3. Use the **Hint** button for strategic advice
4. Try to beat your best score!

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript
- **Storage**: In-memory for server stats, localStorage for client
