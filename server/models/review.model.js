// reviewModel.js
import mongoose from 'mongoose'
const { Schema } = mongoose;

const reviewSchema = new Schema({
  employer: {
    type: Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  jobSeeker: {
    type: Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
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