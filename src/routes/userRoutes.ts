import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// User CRUD

// Create User
router.post('/', (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});

// List USers
router.get('/', async (req, res) => {
    const allUsers = await prisma.user.findMany();
    // res.status(501).json({error: 'Not implemented'});
    res.json(allUsers);
});

// get one user
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const user = await prisma.user.findUnique({where: {id: Number(id)}}); // in params 'id' is a string type, but in our model, id is Int type, so convert it to Number
    res.json(user);
});

// update user
router.put('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: `Not implemented: ${id}`});
});

// delete user
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: `Not implemented: ${id}`});
});

export default router;