import express from 'express';
import {uploads} from '../multer.js'
import { getJobSeekerDetails, applyForJob, removeJobFromAppliedJobs, postJobSeekerCV, getRelevantJobSeekers  } from '../controllers/jobSeeker.controller.js'

const router = express.Router();

router.get('/getJobSeekerDetails/:id', getJobSeekerDetails)
router.post('/applyForJob/:id/user/:id2', applyForJob)
router.post('/removeJobFromAppliedJobs/:id/user/:id2', removeJobFromAppliedJobs )
router.post('/jobSeekerCV/postCV/:id', postJobSeekerCV)
router.get('/getRelevantJobSeekers', getRelevantJobSeekers)


export default router;