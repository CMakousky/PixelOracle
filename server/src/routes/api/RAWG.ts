import express from 'express';
import type { Request, Response } from 'express';
// import { Game } from '../../models/Games.js';

const router = express.Router();

// GET /games - Get games from RAWG
router.get('/games', async (_req: Request, res: Response) => {
  try {
    // console.log(process.env.RAWG_API_KEY);
    console.log(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}`);
    const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}`);
    //console.log('Response:', response);
    const data = await response.json();
    if (!response.ok) {
      throw new Error('invalid API response, check the network tab');
    }
    //Express returns the "data" on the "res" object
    res.status(200).send(data);
  } catch (err) {
    console.log('an error occurred', err);
    res.json();
  }
});

// GET /gamesByName/:name - Get games from RAWG by name
router.get('/gamesByName/:name', async (req: Request, res: Response) => {
  try {
    // console.log(process.env.RAWG_API_KEY);
    console.log(`https://api.rawg.io/api/games?search=${req.params.name}&search_exact=true&key=${process.env.RAWG_API_KEY}`);
    const response = await fetch(`https://api.rawg.io/api/games?search=${req.params.name}&search_exact=true&key=${process.env.RAWG_API_KEY}`);
    //console.log('Response:', response);
    const data = await response.json();
    if (!response.ok) {
      throw new Error('invalid API response, check the network tab');
    }
    //Express returns the "data" on the "res" object
    res.status(200).send(data);
  } catch (err) {
    console.log('an error occurred', err);
    res.json();
  }
});

export { router as rawgRouter };
