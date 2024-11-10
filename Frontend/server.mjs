// server.mjs
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config(); // Load environment variables from .env file

// Initialize the OpenAI API with your key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
let isDining = false;
let diningData = {};
async function run(diningName) {
    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');

        // Now let's list collections in the 'hackumassxiii' database
        const db = client.db('HackUMassXIII'); // Connect to the correct database name
        const collection = db.collection(diningName);
        const data = await collection.find({}).toArray();

        // Check if data exists and print it
        if (data.length > 0) {
            // const jsonData = JSON.stringify(data, null, 2); // `null, 2` makes the JSON output more readable
            diningData = data;
            // console.log('Collection data as JSON:', jsonData);
            isDining = true;
        } else {
            console.log('No data found in the collection.');
        }
    } finally {
        // Close the connection after the operation is complete
        await client.close();
    }
}

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
    console.log('Received request:', req.body);
    const userMessage = req.body.message;

    const diningHallName = req.body.diningHallName;
    if (!diningHallName) {
        return res.status(400).send('Dining hall name is required');
    }

    if (!isDining) {
        try {
            run(diningHallName.toLowerCase()).catch(console.dir);
        } catch (err) {
            console.error('Error retrieving data:', err);
        }
    } else {
        console.log('stored already');
    }

    const diningMessages = diningData.map((item) => {
        return { role: 'system', content: `Here are the available meals: ${JSON.stringify(item.meals, null, 2)}` };
    });
    const messages = [...diningMessages, { role: 'user', content: userMessage }];
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
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
