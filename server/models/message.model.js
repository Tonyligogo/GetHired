import mongoose from 'mongoose'
const { Schema } = mongoose;

export const messageSchema = new Schema({
    conversationId: {
        type: String,
        required:true
    },
    userId: {
        type: String,
        required:true
    },
    content: {
        type: String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model('Message', messageSchema)