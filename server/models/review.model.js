// reviewModel.js
import mongoose from 'mongoose'
const { Schema } = mongoose;

const reviewSchema = new Schema({
  employer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobSeeker: {
    type: String,
    required: true
  },
  star: {
    type: Number,
    required: true,
    enum:[1,2,3,4,5]
  },
  review: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Review', reviewSchema)