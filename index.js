const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());

app.use(userRouter)

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
