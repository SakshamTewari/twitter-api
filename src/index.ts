import { error } from 'console';
import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';

const app = express();
app.use(express.json());

// User route
app.use('/user', userRoutes);

// Tweet route
app.use('/tweet', tweetRoutes);

// Home
app.get('/', (req,res) => {
    res.send('Hello World');
} );

app.listen(3000, () => {
    console.log("Server ready at localhost:3000");
})