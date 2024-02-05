import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentsSchema = new Schema({
    userId:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true,
    }
},{timestamps: true});

export default mongoose.model('Comments', commentsSchema)