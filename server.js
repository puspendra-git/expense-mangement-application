const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectDb");

// Config dotenv file
dotenv.config();

// Database call
connectDb();

// Rest object 
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/api/v1/users', require('./routes/userRoute'));

// transection routes
app.use('/api/v1/transections', require('./routes/transectionRoutes'));


// Uncomment for basic server check
// app.get("/", (req, res) => {
//     res.send("<h1>Hello from server</h1>");
// });

const PORT = process.env.PORT || 8080;

// Listen server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
