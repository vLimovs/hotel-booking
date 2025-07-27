import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './configs/controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';

connectDB()

const app = express()
app.use(cors()) // Enable Cross-Origin Resource Sharing

// Middleware
app.use(express.json())
app.use(clerkMiddleware())


// api to listen clerk webhooks
app.use('/api/clerk', clerkWebHooks)

app.get('/', (req, res) => res.send('API is working fine'))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));