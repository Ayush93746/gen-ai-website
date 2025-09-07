// Import required libraries
const express = require('express');
const cors = require('cors'); // To allow requests from your front-end

const app = express();
const port = 3000;

// The API key is now stored securely on the server
const API_KEY = "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";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// A single endpoint to handle all chat requests
app.post('/generate-content', async (req, res) => {
    try {
        const { message } = req.body;

        const payload = {
            contents: [{ parts: [{ text: message }] }],
            systemInstruction: {
                parts: [{
                    text: "You are a helpful medical information assistant. Provide clear, concise, and easy-to-understand information about health topics. Always end your response with a strong recommendation to consult a medical professional for a proper diagnosis and treatment plan. Never provide a diagnosis or prescription."
                }]
            }
        };

        // Use the native fetch() function, which is available in Node.js v18 and higher
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        res.json(result); // Send the API response back to the front-end

    } catch (error) {
        console.error("Error in /generate-content endpoint:", error);
        res.status(500).json({ error: "Failed to fetch from API." });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
