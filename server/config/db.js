import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined');
  await mongoose.connect(uri);
  console.log('✅ MongoDB Connected');
};

export default connectDB;