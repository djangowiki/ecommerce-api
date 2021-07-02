const mongoose = require('mongoose');

// Database Connection Function.
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log(`Database Connected on the ${conn.connection.host}`);
};

module.exports = connectDB;
