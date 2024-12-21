import { Router, Request, Response } from "express";
import { User } from "../../models/index.js";

const router = Router();


router.get('/:id', async (req: Request, res: Response) => {
    try {
     // hoping this works, haven't had to use a join yet :O
     const { id } = req.params;
     const userData = await User.findByPk(id);
      // const userData = await User.findByPk(req.params.user_id, {
      //   include: [{ model: Game, as: 'favorited games' }],
      // });

      if (!userData) {
        res.status(404).json({ message: 'No user found with that id!' });
        return;
      }
  
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.post('/', async (req: Request, res: Response) => {
    try {
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  });

  router.put('/addFavoriteGames/:id', async (req: Request, res: Response) => {
    //Add favorites games to a specified user_id
    const { id } = req.params;
    //The list of games must be an array of JSON following the Game type
    const { favorites } = req.body;
    try {
      const user = await User.findByPk(id);
      if (user) {
        user.favorites = favorites;
        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });


  export { router as userRouter }