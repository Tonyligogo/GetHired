import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true  
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: false,
    },
},{timestamps: true});

export default mongoose.model('User', userSchema)