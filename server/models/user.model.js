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
        unique: true
    },
    password:{
        type: String
    },
    image:{
        type: String
    },
},{timestamps: true});

export default mongoose.model('User', userSchema)