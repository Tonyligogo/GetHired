import mongoose from "mongoose";
import JobSeeker from "../models/jobSeeker.model.js";
import Review from "../models/review.model.js";

// Create a new review
export const createReview = async (req, res) => {
  const { star, review } = req.body;
  const { employerId, jobSeekerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(employerId) || !mongoose.Types.ObjectId.isValid(jobSeekerId)) {
    return res.status(400).json({ error: 'Invalid employerId or jobSeekerId' });
}
  const employerObjectId = new mongoose.Types.ObjectId(employerId);
  try {
    // Check if the employer has already reviewed the job seeker
    const existingReview = await Review.findOne({ employer: employerObjectId, jobSeeker: jobSeekerId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this job seeker' });
    }

    // Create a new review
    const newReview = await Review.create({
       employer: employerObjectId, 
       jobSeeker: jobSeekerId, 
       star, 
       review });

       await JobSeeker.findOneAndUpdate({user:jobSeekerId},
        {$inc: {totalStars: star, starNumber: 1} }
        )

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReviews = async (req,res) =>{
  const { id } = req.params;
  try {
    const reviews = await Review.find({jobSeeker: id})
    .populate({path:'employer', options: { strictPopulate: false }})
    .exec()
    res.status(201).send(reviews)
  } catch (error) {
    res.status(500).json({ error: 'Server error' }); 
  }
}


