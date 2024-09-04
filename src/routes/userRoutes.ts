import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// User CRUD

// Create User
router.post('/', async (req, res) => {
  const { email, name, username } = req.body;
  // console.log(email, name, username);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
      },
    }); // check if the data sequence should be same as what we pass in curl
    res.json(user);
  } catch (e) {
    const errorMessage = (e as Error).message;
    res.status(400).json({ error: errorMessage });
  }
});

// List USers
router.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany();
  // res.status(501).json({error: 'Not implemented'});
  res.json(allUsers);
});

// get one user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  }); // in params 'id' is a string type, but in our model, id is Int type, so convert it to Number

  if (!user) {
    return res.status(404).json({ error: 'User Not found!!' });
  }
  res.json(user);
});

// update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // only bio, name, image are allowed to be updated
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update the user' });
  }
});

// delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
