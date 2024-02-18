import mongoose from 'mongoose'
const { Schema } = mongoose;

const jobSeekerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    appliedJobs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post' 
        }],
        default:() => []
    },
    cv: {
        type: Schema.Types.ObjectId,
        ref: 'CV'
      }

},{timestamps: true});

export default mongoose.model('JobSeeker', jobSeekerSchema)


    // savedJobs: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Post' }]

