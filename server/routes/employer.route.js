import express from 'express';
import { createPost  } from '../controllers/post.controller.js'
import { getEmployerData, dismissApplicant, reserveApplicant} from '../controllers/employer.controller.js';

const router = express.Router();

router.post('/createPost/:id', createPost)
router.get('/getEmployerData/:id', getEmployerData)
router.post('/jobs/:jobId/dismiss/:applicantId', dismissApplicant)
router.post('/jobs/:jobId/reserve/:jobSeekerId', reserveApplicant)



export default router;