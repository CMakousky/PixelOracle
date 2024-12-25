import { User } from '../models/index.js';

export const seedUsers = async () => {
  await User.bulkCreate(
    [
      { 
        username: 'proGamer', 
        email: 'progamer@uberleet.com', 
        password: 'password', 
        favorites: [] 
      },
      { 
        username: 'noob',
        email: 'nooblet@uberleet.com',
        password: 'password',
        favorites: [] 
      },
    ],
    { individualHooks: true }
  );
};
