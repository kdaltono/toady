const express = require('express')
const cors = require('cors')

// This program doesn't work when running in docker, only works when run locally! Pls find the issue

const app = express()

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions))

// Parse request of content-type - application/json
app.use(express.json())

// Parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to toady REST application." });
});

require("./app/routes/toady.routes")(app)

// Set port, listen for requests:
const PORT = 8080
app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT)
})