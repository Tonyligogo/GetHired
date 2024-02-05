import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";

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
export const getSinglePost = async (req, res)=>{;
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
