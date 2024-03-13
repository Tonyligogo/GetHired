import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    image:{
        type: String
    },
    role:{
        type:String,
        required:true
    },
    niche:{
        type:String,
        required:true
    }
},{timestamps: true});

export default mongoose.model('User', userSchema)