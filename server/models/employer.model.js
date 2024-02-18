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
    }
});

export default mongoose.model('Employer', employerSchema);
