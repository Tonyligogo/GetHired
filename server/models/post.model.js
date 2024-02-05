import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    companyName:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    },
    salary:{
        type: Number,
        required: true,
    },
    locationType:{
        type: String,
        required: true,
    },
    applicationEmail:{
        type: String,
        required: false,
    },
    applicationUrl:{
        type: String,
        required: false,
    },
    location:{
        type: String,
        required: false,
    },
    companyLogo:{
        type: String,
        required: false,
    }
},{timestamps: true});

export default mongoose.model('Post', postSchema)