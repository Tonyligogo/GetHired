import express from 'express';
import { deletePost, createPost, getPosts, getSinglePost, getUnapprovedJobs, approveJobUpdate, deleteApprovalJob, getFilteredPosts } from '../controllers/post.controller.js'

const router = express.Router();

router.post('/createPost/:id', createPost)
router.delete('/deletePost/:id', deletePost)
router.get('/getPosts', getPosts)
router.get('/getUnapprovedJobs', getUnapprovedJobs)
router.put('/approveJobUpdate/:id', approveJobUpdate)
router.delete('/deleteApprovalJob/:id', deleteApprovalJob)
router.get('/getSinglePost/:id', getSinglePost)
router.get('/getFilteredPosts', getFilteredPosts)


export default router;