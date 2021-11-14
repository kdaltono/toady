const express = require('express')
const cors = require('cors')

// TODO: Get gitignore working

const app = express()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: [ 'GET', 'POST', 'OPTIONS' ],
    headers: [ 'content-type' ]
}

app.use(cors(corsOptions))
app.options('*', cors());

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