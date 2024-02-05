import mongoose from 'mongoose';
const { Schema } = mongoose;

const googleUserSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    }
},{timestamps: true});

export default mongoose.model('GoogleUser', googleUserSchema)