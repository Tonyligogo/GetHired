import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
      },
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
        required: true,
    },
    requirements:{
        type: String,
        required: true,
    },
    salary:{
        type: Number,
        required: true,
    },
    locationType:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: false,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    applicants: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User' 
        }],
        default:() => []
    }
},{timestamps: true});

export default mongoose.model('Post', postSchema)