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
            return diningData[0].meals;
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
    const height = req.body.height;
    const weight = req.body.weight;
    const calories = req.body.calories;
    const restrictions = req.body.restrictions;
    let messages;
    const diningHallName = req.body.diningHallName;
    if (!diningHallName) {
        return res.status(400).send('Dining hall name is required');
    }
    let mealData;
    let mealString;
    if (!isDining) {
        try {
            mealData = await run(diningHallName.toLowerCase()).catch(console.dir);
            const currentHour = new Date().getHours();
            if (currentHour >= 11 && currentHour < 16) {
                mealData = mealData.lunch;
            } else if (currentHour >= 16 && currentHour < 21) {
                mealData = mealData.dinner;
            } else if (currentHour >= 21) {
                mealData = mealData.latenight;
            } else {
                mealData = mealData.breakfast;
            }
            mealString = mealData
                .map((mealObj) => {
                    return `Meal: ${mealObj.name}\nServing Size: ${mealObj.serving_size}\nCalories: ${mealObj.calories}\nProtein: ${mealObj.protein}\nIngredients: ${mealObj.ingredients}\nDiet: ${mealObj.diet}\nAllergens: ${mealObj.allergens}`;
                })
                .join('\n\n');
        } catch (err) {
            console.error('Error retrieving data:', err);
        }
    } else {
        console.log('stored already');
    }

    try {
        messages = [
            {
                role: 'system',
                content: `I'm ${height} inches tall, I weight ${weight} pounds, want to eat around ${calories}, and have these food restrictions: ${restrictions}.Here are the available meals: \n${mealString}`,
            },
            { role: 'user', content: userMessage },
        ];
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
