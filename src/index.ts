import { error } from 'console';
import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';

const app = express();
app.use(express.json());

// User route
app.use('/user', authenticateToken, userRoutes);

// Tweet route
app.use('/tweet', authenticateToken, tweetRoutes);

// Auth route
app.use('/auth', authRoutes);

// Home
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});
