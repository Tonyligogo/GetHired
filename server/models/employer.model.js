import mongoose from 'mongoose'
const { Schema } = mongoose;

const employerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postedJobs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post' 
        }],
        default:() => []
    },
    niche:{
        type: String,
        ref:'User',
        required:true
      },
    coins: { 
        type: Number, 
        default: 30 
      }
});

export default mongoose.model('Employer', employerSchema);
