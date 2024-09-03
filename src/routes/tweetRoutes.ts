import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Tweet CRUD

// Create tweet
router.post('/', async (req, res) => {
    const { content, image, userId } = req.body;
    try {
      const tweet = await prisma.tweet.create({
        data: {
          content,
          image,
          userId,  //TODO : manage based on auth user
        },
      });
      res.json(tweet);
    } catch (e) {
      const errorMessage = (e as Error).message;
      res.status(400).json({ error: errorMessage });
    }
});

// List tweets
router.get('/', (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});

// get one tweet
router.get('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: `Not implemented: ${id}`});
});

// update tweet
router.put('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: `Not implemented: ${id}`});
});

// delete tweet
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: `Not implemented: ${id}`});
});

export default router;