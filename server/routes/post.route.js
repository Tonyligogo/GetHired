import express from 'express';
import {uploads} from '../multer.js'
import { deletePost, createPost, getPosts, getSinglePost, getUnapprovedJobs, approveJobUpdate, deleteApprovalJob } from '../controllers/post.controller.js'

const router = express.Router();

router.post('/createPost', createPost)
router.delete('/deletePost/:id', deletePost)
router.get('/getPosts', getPosts)
router.get('/getUnapprovedJobs', getUnapprovedJobs)
router.put('/approveJobUpdate/:id', approveJobUpdate)
router.delete('/deleteApprovalJob/:id', deleteApprovalJob)
router.get('/getSinglePost/:id', getSinglePost)


export default router;