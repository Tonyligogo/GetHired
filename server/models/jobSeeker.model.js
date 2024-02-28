import mongoose from "mongoose";
const { Schema } = mongoose;

const jobSeekerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appliedJobs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: () => [],
    },
    employedJobs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: () => [],
    },
    cv: {
      type: Schema.Types.ObjectId,
      ref: "CV",
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    coins: { 
      type: Number, 
      default: 50 
    }
  },
  { timestamps: true }
);

export default mongoose.model("JobSeeker", jobSeekerSchema);

// savedJobs: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Post' }]
