import express from 'express';
import { hireJobSeeker } from '../controllers/hireJobSeeker.controller.js';

const router = express.Router();

router.post('/:jobSeekerId/jobId/:jobId',  hireJobSeeker)


export default router;