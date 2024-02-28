import JobSeeker from "../models/jobSeeker.model.js";
import Post from "../models/post.model.js";

// Backend API endpoint for employing job seekers
export const hireJobSeeker =  async (req, res) => {
    const { jobId, jobSeekerId } = req.params;
    try {
      // Update the job application to mark the job seeker as employed
      const post = await Post.findById(jobId);
      post.status = 'Closed';
      post.employedJobSeeker = jobSeekerId
      await post.save();

     let jobSeeker = await JobSeeker.findOneAndUpdate(
      { user: jobSeekerId },
      { $addToSet: { employedJobs: jobId } },
      { new: true }
    );
  
    return res.status(201).json({
        status: true,
        message: "Job seeker employed successfully",
        post:post,
        jobSeeker:jobSeeker
      });
    } catch (error) {
      console.error('Error employing job seeker:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  