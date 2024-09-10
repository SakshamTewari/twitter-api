import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers['authorization'];
  const jwtToken = authHeader?.split(' ')[1];
  if (!jwtToken) {
    return res.sendStatus(401);
  }

  // decode the jwt token
  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };

    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    // if dbToken expirted or invalid
    if (!dbToken || !dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: 'API token expired' });
    }

    // we need to add user to req so that next handlers can access it
    req.user = dbToken.user; // note how I changed 'Request' to add 'user' property
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
}
