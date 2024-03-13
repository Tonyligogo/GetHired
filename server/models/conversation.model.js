import mongoose from 'mongoose'
const { Schema } = mongoose;

export const conversationSchema = new Schema({
    id: {
        type: String,
        unique:true,
        required:true
    },
    jobTitle: {
        type: String,
        required:false
    },
    employerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobSeekerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    readByEmployer: {
        type: Boolean,
        required:true
    },
    readByJobSeeker: {
        type: Boolean,
        required:true
    },
    lastMessage: {
        type: String,
        required:false
    },
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema)