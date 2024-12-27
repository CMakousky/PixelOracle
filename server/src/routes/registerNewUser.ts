import { Router, Request, Response } from "express";
import { User } from "../models/index.js";

const router = Router();

// POST /users/ - new user
router.post('/', async (req: Request, res: Response) => {
  try {
    // Extract username from request body
    const { username } = req.body;
    // Find the user in the database by username
    const user = await User.findOne({
      where: { username },
    });
    // If user is not found, continue registering new user.
    if (!user) {
      User.create(req.body);
      res.status(200).json({ message: `Registration of "${username}" successful.` });
    } else {
      res.status(406).json({ message: `"${username}" is not an available username.` });
    };
  } catch (err) {
    res.status(400).json(err);
  }
});

export { router as newUserRouter }