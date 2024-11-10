// server.mjs
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables from .env file

// Initialize the OpenAI API with your key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure .env has OPENAI_API_KEY
});

const mongoURI = process.env.MONGODB_URI;
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());
app.use(cors());

const getDiningHallModel = (diningHallName) => {
    return mongoose.model(
        diningHallName,
        new mongoose.Schema({
            name: String,
            meals: [
                {
                    name: String,
                    description: String,
                    dietaryInformation: String,
                    ingredients: [String],
                },
            ],
        }),
    );
};

app.post('/api/chat', async (req, res) => {
    console.log('Received request:', req.body);
    const userMessage = req.body.message;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
            temperature: 0.7,
        });

        const botMessage = completion.choices[0].message.content;
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Error communicating with the AI model');
    }
});

// Define the server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
