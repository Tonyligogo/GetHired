import Post from "../models/post.model.js";
import Employer from "../models/employer.model.js";

export const createPost = async (req, res) => {
  const {requirements} = req.body
  const requirementsArray = requirements.split(",").map((requirement) => requirement.trim());
  const newPost = new Post({
    owner: req.params.id,
    title: req.body.title,
    type: req.body.type,
    companyName: req.body.companyName,
    locationType: req.body.locationType,
    salary: req.body.salary,
    location: req.body.location,
    niche: req.body.niche,
    description: req.body.description,
    requirements: requirementsArray,
  });
  try {
    let employer = await Employer.findOne({ user: req.params.id });
    if (!employer) {
      // employer = new Employer({user:req.params.id})
      // await employer.save()
      return res.status(404).send("Employer not found");
    }
    if (employer.coins < 10) {
      return res.status(403).json({ error: 'Insufficient coins to post a job' });
    }
    await newPost.save();

    employer = await Employer.findOneAndUpdate(
      { user: req.params.id },
      // { $addToSet: { postedJobs: newPost._id } },
      { 
        $addToSet: { postedJobs: newPost._id },
        $inc: { coins: -10 } // Deduct 10 coins from the employer's balance
      },
      { new: true }
    );
    res.status(201).json({
      status: true,
      message: "Post has been created",
      post: newPost,
      employer: employer,
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
    console.log(err);
  }
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Not logged in");
  await Post.findByIdAndDelete(req.params.id);
  res.status(201).send("deleted");
};

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) -1 || 0;
  const limit = 2
  try {
    const jobs = await Post.find()
    .skip(page*limit)
    .limit(limit)
    .sort({ createdAt: -1 })

    const total = await Post.countDocuments()

    // return res.json(jobs);
    return res.status(201).json({
      jobs,
      total,
      page:page+1,
      limit,
      success: true,
      message: "Jobs fetched successfully",
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error: error while fetching jobs",
      error: error,
    });
  }
};

export const getFilteredPosts = async (req, res) => {
  const { title, type, location, locationType } = req.query;

  // Construct case-insensitive regular expressions for each search term
  const regexTitle = new RegExp(title, 'i');
  const regexLocationType = new RegExp(locationType, 'i');
  const regexType = new RegExp(type, 'i');
  const regexLocation = new RegExp(location, 'i');

  // Construct the query object with case-insensitive regular expressions
  const query = {
    status: 'open', 
    niche: req.body.niche
  };
  if (title) query.title = { $regex: regexTitle };
  if (type) query.type = { $regex: regexType };
  if (location) query.location = { $regex: regexLocation };
  if (locationType) query.locationType = { $regex: regexLocationType };


  try {
  // Execute the query and return the results
  res.json(await Post.find(query).sort({ createdAt: -1 }));
}catch(error){
  console.log(error, 'error when fetching jobs')
}
};

export const getSinglePost = async (req, res) => {
  try {
    await Post.findById(req.params.id).then((result) => {
      if (result) {
        res.status(201).json({
          post: result,
          success: true,
          message: "Single job fetched",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "There is no job with the specified id",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: error while fetching job",
      error: error,
    });
  }
};
export const getUnapprovedJobs = async (req, res) => {
  try {
    await Post.find({ approved: false }).then((result) => {
      if (result) {
        res.status(201).json({
          jobs: result,
          success: true,
          message: "Unapproved jobs fetched",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "There is no jobs with the approved false field.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: error while fetching unapproved jobs",
      error: error,
    });
  }
};
export const approveJobUpdate = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { approved: true })
    .then((result) => {
      if (!result) {
        res.status(404).json({
          success: false,
          message: "The job was not approved",
        });
      }
      res.status(200).json({
        success: true,
        message: `The job was successfully approved`,
        result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Job approval failed",
        error: error,
      });
    });
};
export const deleteApprovalJob = async (req, res) => {
  //This deletes the jobs that are available for approval

  // const token = req.cookies.accessToken;
  // if(!token) return res.status(401).send('Not logged in');

  await Post.findByIdAndDelete(req.params.id);
  res.status(201).send("deleted");
};

