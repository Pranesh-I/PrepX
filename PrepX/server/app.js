const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());            //middleware we use app.use to use cors in our app and allow cross-origin requests
app.use(express.json());    //middleware we use app.use to parse incoming JSON data in the request body and make it available under req.body

//define routes
app.get("/", (req, res) => {
    res.json({
        success : true,
        message : "API is working"
    });
});

module.exports = app;