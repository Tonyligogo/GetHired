import express from 'express';
import { createReview } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/createReview/:jobSeekerId/:employerId',  createReview)


export default router;