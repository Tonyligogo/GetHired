import Employer from "../models/employer.model.js";
import JobSeeker from "../models/jobSeeker.model.js";
import Post from "../models/post.model.js";

export const getEmployerData = async (req, res) => {
    const { id } = req.params;
  
    try {
      const employer = await Employer.findOne({user: id})
      .populate({ path: "user", options: { strictPopulate: false } })
      .populate({ 
        path: "postedJobs",
        options: { strictPopulate: false },
        populate: { path: "applicants" } 
      })
      .exec()

      if(!employer){
        return res.status(401).json({msg:"No such employer found!"});
        // employer = new Employer({user: employerId})
      }

      res.json(employer);
    } catch (error) {
      console.error('Error fetching employer details:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

export const dismissApplicant = async (req, res) => {
  const jobId = req.params.jobId;
  const applicantId = req.params.applicantId;
  
    try {
      // remove applicant from the list of applicants in the post model
    const job = await Post.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'This post does not exist!' });
    }
    job.applicants = job.applicants.filter(applicant => applicant._id.toString() !== applicantId);
    await job.save();

    // remove the job from list of applied jobs in job seeker's model
    const jobseeker = await JobSeeker.findOne({user:applicantId});
    if (!jobseeker) {
      return res.status(404).json({ error: 'JobSeeker not found' });
    }
    jobseeker.appliedJobs = jobseeker.appliedJobs.filter(id => id.toString() !== jobId);
    await jobseeker.save();

    res.json({ message: 'Applicant dismissed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reserveApplicant = async (req, res) => {
  const {jobId, jobSeekerId} = req.params
  try {
    // check if the job exists
    const job = await Post.findById(jobId);
    if (!job) throw new Error('Job not found');

    // Check if the job seeker exists
    const jobSeeker = await JobSeeker.findOne({ user: jobSeekerId });
    if (!jobSeeker) {
      return res.status(404).json({ error: "Job seeker not found" });
    }

    // Add the jobSeeker id to the applicants array of the post
    if (Array.isArray(job.reservedApplicants)) {
      job.reservedApplicants.addToSet(jobSeekerId);
    } else {
      job.reservedApplicants = [jobSeekerId];
    }

    await job.save();

    return res.status(201).json(job);
  } catch (error) {
    console.error("Error reserving applicant:", error);
    res.status(500).json({ error: "Server error" });
  }
};
