import { Router, Request, Response } from "express";
import { Game } from "../../models/index.js";

const getAllGames = async (_req: Request, res: Response) => {
    try {
      const games = await Game.findAll();
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
const addGame = async (req: Request, res: Response) => {
    try {
      const favgameData = await Game.create(req.body);
      res.status(200).json(favgameData);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  const deleteGame = async (req: Request, res: Response) => {
    try {
      const favgameData = await Game.destroy({
        where: {
          game_id: req.params.game_id,
        },
      });
  
      if (!favgameData) {
        res.status(404).json({ message: 'Error Occured: Incorrect Game ID' });
        return;
      }
  
      res.status(200).json(favgameData);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
  const router = Router();
  router.get('/', getAllGames);
  router.post('/', addGame)
  router.delete('/:id', deleteGame)
  
  export { router as gameRouter };
  