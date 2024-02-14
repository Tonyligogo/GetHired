import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";
import { connect } from "../index.js";

export const createPost = async (req, res)=>{
    try{
        // const token = req.cookies.accessToken;
        // if(!token) return res.status(401).send('Not logged in');
        // jwt.verify(token, process.env.JWT_KEY, async (err, info)=>{
        //   if(err){
        //     console.log(err, 'This is a token verification error')
        //     return
        //   }          
          const newPost = new Post({
              title: req.body.title,
              type:req.body.type,
              companyName:req.body.companyName,
              locationType:req.body.locationType,
              salary:req.body.salary,
              applicationEmail:req.body.applicationEmail,
              applicationUrl:req.body.applicationUrl,
              location:req.body.location,
              description: req.body.description,
              approved: req.body.approved
          })
          // if(req.body.companyLogo){
          //     newPost.companyLogo = req.file.path
          // }
          await newPost.save();
          res.status(201).json({
              status: true,
              message: 'Post has been created',
              post: newPost,
            });
        
    }catch(err){
        res.status(500).send('Something went wrong')
        console.log(err)
    }
}

export const deletePost = async (req, res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).send('Not logged in');
    await Post.findByIdAndDelete(req.params.id)
    res.status(201).send('deleted')
}

export const getPosts = async (req, res)=>{
    // const token = req.cookies.accessToken;
    // if(!token) return res.status(401).send('Not logged in');
    res.json(
        await Post.find()
        // .populate('postedBy', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    )
}
export const getSinglePost = async (req, res)=>{
  try {
    await Post.findById(req.params.id).then((result) => {
          if (result) {
            res.status(201).json({
              post: result,
              success: true,
              message: "Single blog fetched",
            });
          } else {
            res.status(401).json({
              success: false,
              message:
                "There is no blog with the specified id",
            });
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error: error while fetching blog",
          error: error,
        });
      }
}
export const getUnapprovedJobs = async (req, res)=>{
  try {
    await Post.find({approved : false}).then((result) =>{
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
}
export const approveJobUpdate = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {approved: true})
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
export const deleteApprovalJob = async (req, res)=>{
  //This deletes the jobs that are available for approval 

  // const token = req.cookies.accessToken;
  // if(!token) return res.status(401).send('Not logged in');

  await Post.findByIdAndDelete(req.params.id)
  res.status(201).send('deleted')
}