import { Router, Request, Response } from "express";
import { User } from "../../models/index.js";
import { Game } from "../../models/Games.js";

const router = Router();

// GET /users/:id - user by id
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

// GET /users/getFavorites/:id - Favorites by specified user id
router.get('/getFavorites/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userData = await User.findByPk(id);
    if (!userData) {
      res.status(404).json({ message: 'No user found with that id!' });
      return;
    }
    const favorites = userData.favorites;
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /users/ - new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE /users/:id - Delete a user by id
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /users/addFavoriteGames/:id - Add favorites games to a specified user_id
router.put('/addFavoriteGames/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  //The list of games must be an array of JSON following the Game type
  const { favorites } = req.body;
  console.log(favorites);
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

// DELETE /users/deleteFavoriteGames/:id - user favorites
router.delete('/deleteFavoriteGames/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.favorites = [] as Game[];
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