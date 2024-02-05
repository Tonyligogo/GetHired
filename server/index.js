import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
dotenv.config()

export const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('connected to mongo')
    }catch(error){
        console.log(error);
    }
}

app.use(express.json()); 
app.use(cookieParser())
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      credentials: true,
    })
  );
app.use("/uploads", express.static("uploads"));

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/post', postRoute)
app.use('/comment', commentRoute)

app.listen(8000, ()=>{
    connect()
    console.log('backend running');
})