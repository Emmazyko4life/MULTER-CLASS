require('dotenv').config();
require('./config/database');
const express = require('express');
const PORT = process.env.PORT;
const app = express();

app.use(express.json());


app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`)
 })

