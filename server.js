//here we create the server

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

//we have middleware here
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({message: 'route not dedfined'});

})

const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log(`server is run on port ${PORT}`);
    
})