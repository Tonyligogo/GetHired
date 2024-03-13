import CV from "../models/cv.model.js";
import JobSeeker from "../models/jobSeeker.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getJobSeekerDetails = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ user: req.params.id })
      .populate({ path: "user", options: { strictPopulate: false } })
      .populate({ path: "appliedJobs" })
      .populate({ path: "cv" })
      .exec();

    if (!jobSeeker) {
      return res.status(401).json({
        message: "Details not found",
        details: null,
      });
    }
    res.json(jobSeeker);
  } catch (error) {
    console.error("Error fetching job seeker:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getRelevantJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.find({ niche: req.query.niche })
      .populate({ path: "user", options: { strictPopulate: false } })
      .populate({ path: "cv" })
      .select("user cv")
      .exec();

    if (!jobSeekers) {
      return res.status(401).json({
        message: "No jobseekers found within your niche.",
        jobSeekers: null,
      });
    }
    res.json(jobSeekers);
  } catch (error) {
    console.error("Error fetching jobseekers within your niche: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller function to apply for a job
export const applyForJob = async (req, res) => {
  const { id, id2 } = req.params;

  try {
    // Check if the job seeker exists
    let jobSeeker = await JobSeeker.findOne({ user: id2 });
    if (!jobSeeker) {
      return res.status(404).json({ error: "Job seeker not found" });
    }

    // Check if the job exists
    const job = await Post.findById(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if the jobSeeker has enough coins
    if (jobSeeker.coins < 5) {
      return res.status(403).json({ error: 'Insufficient coins to apply for a job' });
    }else{
      jobSeeker.coins -= 5;
    }

    // Add the jobSeeker id to the applicants array of the post
    if (Array.isArray(job.applicants)) {
      job.applicants.addToSet(id2);
    } else {
      job.applicants = [id2];
    }
    await job.save()
    
    let cvData = await CV.findOne({ owner: id2 });

    if (!jobSeeker) {
      if (cvData) {
        jobSeeker = new JobSeeker({ user: id2, cv: cvData._id });
      } else {
        jobSeeker = new JobSeeker({ user: id2 });
      }
    }

    // Add the job ID to the appliedJobs array of the job seeker

    if (Array.isArray(jobSeeker.appliedJobs)) {
      jobSeeker.appliedJobs.addToSet(id);
    } else {
      jobSeeker.appliedJobs = [id];
    }

    await jobSeeker.save();

    res.json({ message: "Job applied successfully" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller function to remove a job reference from appliedJobs
export const removeJobFromAppliedJobs = async (req, res) => {
  const { id, id2 } = req.params;

  try {
    // Find the job seeker document by ID
    const jobSeeker = await JobSeeker.findOne({ user: id2 });
    if (!jobSeeker) {
      return res.status(404).json({ error: "Job seeker not found" });
    }

    // Remove the jobId from the appliedJobs array
    jobSeeker.appliedJobs.pull(id);

    // Save the updated job seeker document
    await jobSeeker.save();

    res.json({ message: "Job removed from applied jobs successfully" });
  } catch (error) {
    console.error("Error removing job from applied jobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//jobSeeker cv
export const postJobSeekerCV = async (req, res) => {
  try {
    const { about, education, workExperience, skills } = req.body;
    const { id } = req.params;

    // Check if the job seeker exists
    const jobSeeker = await JobSeeker.findOne({ user: id });
    if (!jobSeeker) {
      return res.status(404).json({ error: "Job seeker not found" });
    }
    // Check if the job seeker already has a CV
    const existingCV = await CV.findOne({ owner: id });

    if (existingCV) {
      // If a CV already exists, update it with the new data
      existingCV.about = about;
      existingCV.education = education;
      existingCV.workExperience = workExperience;
      existingCV.skills = skills;

      // Save the updated CV
      const updatedCV = await existingCV.save();
      return res.json(updatedCV);
    } else {
      // Create a new CV document
      const skillsArray = skills.split(",").map((skill) => skill.trim());
      const newCV = new CV({
        owner: id,
        about,
        education,
        workExperience,
        skills: skillsArray,
      });
      // Save the new CV document
      const savedCV = await newCV.save();
      let job = await JobSeeker.findOne({ user: id });
      job.cv = savedCV._id;
      await job.save();
      res.json(savedCV);
    }
  } catch (error) {
    console.error("Error posting CV:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSingleCV = async (req, res)=>{
  try {
    await CV.findOne({owner:req.params.id}).then((result) => {
          if (result) {
            res.status(201).json({
              cv: result,
              success: true,
              message: "Single cv fetched",
            });
          } else {
            res.status(401).json({
              success: false,
              message:
                "There is no cv with the specified id",
            });
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error: error while fetching cv",
          error: error,
        });
      }
}