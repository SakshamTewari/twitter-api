import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

// Generate a random 8-digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Create a user if it doesn't exist
// Generate an EmailToken and send it to user
router.post('/login', async (req, res) => {
  const { email } = req.body;
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000,
  ); // convert EMAIL_TOKEN_EXPIRATION_MINUTES to milliseconds as getTime() is in ms

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: 'EMAIL',
        emailToken,
        expiration,
        // now to connect with userId, we have only 'email' to do a listLookup
        // If a user with the provided email already exists: Prisma will return the existing user and associate that user with the created token.
        // The existing user's id will be included as part of the returned data.
        // If no user with the provided email exists: Prisma will create a new user with the specified email, and the newly created user's id will be returned as part of the returned data.
        // In both cases, the user field in the createdToken will be linked to a user, and the resulting token data will contain the user's information, including the id.
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ error: "Couldn't start the authentication process" });
  }

  // send emailToken to user's email
});

// Validate the emailToken
// Generate a long-lived JWT token
router.post('/authenticate', async (req, res) => {});

export default router;
