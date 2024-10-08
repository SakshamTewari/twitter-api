import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Tweet CRUD

// Create tweet
router.post('/', async (req, res) => {
  const { content, image } = req.body; // not taking userId directly from body, but from authenticateToken middleware
  // @ts-ignore
  const user = req.user;
  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id, // manage based on auth user
      },
    });
    res.json(tweet);
  } catch (e) {
    const errorMessage = (e as Error).message;
    res.status(400).json({ error: errorMessage });
  }
});

/*
we can include relational values as well (like user) and even select what user values we need
for tweets, we can include user info (relational value) as this would not be information heavy
*/

// List tweets

router.get('/', async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  res.json(allTweets);
});

// get one tweet
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });

  if (!tweet) {
    return res.status(404).json({ error: 'Tweet Not found!!' });
  }
  res.json(tweet);
});

// update tweet
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { image, content } = req.body;

  try {
    const result = await prisma.tweet.update({
      where: { id: Number(id) },
      data: { image, content },
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Could not update the tweet' });
  }
});

// delete tweet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
