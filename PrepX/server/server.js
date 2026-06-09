require("dotenv").config();  // Load environment variables from .env file

const app = require("./app");    // Import the Express app from app.js
const connectDB = require("./config/db");  // Import the database connection function

connectDB();  // Connect to the database

const PORT = process.env.PORT || 5000;  // Use the PORT environment variable or default to 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

