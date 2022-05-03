const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/userRouter');

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
