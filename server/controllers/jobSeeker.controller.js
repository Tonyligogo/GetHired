import CV from "../models/cv.model.js";
import JobSeeker from "../models/jobSeeker.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getJobSeekerDetails = async (req, res)=>{
    try {
        const jobSeeker = await JobSeeker.findOne({user: req.params.id})
      .populate(
        {path: 'user', options: { strictPopulate: false }}
      )
      .populate({path:'appliedJobs'})
      .populate('cv')
      .exec();

      if (!jobSeeker) {
        return res.status(404).json({ error: 'Job seeker not found' });
      }
      res.json(jobSeeker)
    } catch (error) {
        console.error('Error fetching job seeker:', error);
        res.status(500).json({ error: 'Server error' });
        }
}

// Controller function to apply for a job
export const applyForJob = async (req, res) => {
  const {id, id2} = req.params;

  try {
    // Check if the job seeker exists
    const user = await User.findById(id2);
    if (!user) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    // Check if the job exists
    const job = await Post.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    let jobSeeker = await JobSeeker.findOne({ user: id2});
    if(!jobSeeker){
      jobSeeker = new  JobSeeker({ user: id2 })
    }

    // Add the job ID to the appliedJobs array of the job seeker

      if (Array.isArray(jobSeeker.appliedJobs)) {
        jobSeeker.appliedJobs.addToSet(id)
      } else {
          jobSeeker.appliedJobs = [id]
      }
    
    await jobSeeker.save();

    res.json({ message: 'Job applied successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller function to remove a job reference from appliedJobs
export const removeJobFromAppliedJobs = async (req, res) => {
  const { id, id2 } = req.params;

  try {
    // Find the job seeker document by ID
    const jobSeeker = await JobSeeker.findOne({user: id2});
    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    // Remove the jobId from the appliedJobs array
    jobSeeker.appliedJobs.pull(id);
    
    // Save the updated job seeker document
    await jobSeeker.save();

    res.json({ message: 'Job removed from applied jobs successfully' });
  } catch (error) {
    console.error('Error removing job from applied jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//jobSeeker cv 
export const postJobSeekerCV = async (req, res) => {
  try {
    const { education, workExperience, skills } = req.body;
    const{id} = req.params

    // Check if the job seeker exists
    const jobSeeker = await JobSeeker.findOne({ user: id })
    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    // Create a new CV document
    const newCV = new CV({
      owner:id,
      education,
      workExperience,
      skills,
      // Add other fields as needed
    });

    // Save the new CV document
    const savedCV = await newCV.save();

    res.json(savedCV);
  } catch (error) {
    console.error('Error posting CV:', error);
    res.status(500).json({ error: 'Server error' });
  }
};