import { error } from 'console';
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

// Home
app.get('/', (req,res) => {
    res.send('Hello World');
} );

app.listen(3000, () => {
    console.log("Server ready at localhost:3000");
})