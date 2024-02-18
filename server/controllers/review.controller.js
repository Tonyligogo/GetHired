import Review from "../models/review.model.js";


// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { employerId, jobSeekerId } = req.params;

    // Check if the employer has already reviewed the job seeker
    const existingReview = await Review.findOne({ employer: employerId, jobSeeker: jobSeekerId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this job seeker' });
    }

    // Create a new review
    const newReview = await Review.create({ employer: employerId, jobSeeker: jobSeekerId, rating, review });
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Calculate the average rating for a job seeker
export const calculateAverageRating = async (jobSeekerId) => {
  try {
    const totalReviews = await Review.find({ jobSeeker: jobSeekerId }).countDocuments();
    const totalRatings = await Review.find({ jobSeeker: jobSeekerId }).select('rating');
    const sumRatings = totalRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = sumRatings / totalReviews;
    return averageRating;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return null;
  }
};
