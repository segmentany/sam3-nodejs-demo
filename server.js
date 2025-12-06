require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual API Key or use .env file
const API_KEY = process.env.SAM3_API_KEY || 'sk_live_YOUR_API_KEY_HERE';
const API_URL = 'https://sam3.ai/api/v1/segment';

// Increase payload limit for base64 images
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/segment', async (req, res) => {
    try {
        const { image, prompts } = req.body;

        if (!image || !prompts) {
            return res.status(400).json({ error: 'Image and prompts are required' });
        }

        console.log(`Sending request to SAM3 API... Prompts: ${prompts}`);

        // Call SAM3 API
        const response = await axios.post(API_URL, {
            image,
            prompts
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        console.log('SAM3 API Response received');
        res.json(response.data);

    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: 'Failed to process segmentation',
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Make sure to set your API Key in server.js or .env file`);
});
