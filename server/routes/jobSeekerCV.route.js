import express from 'express';
import { postJobSeekerCV, getSingleCV } from '../controllers/jobSeeker.controller.js'

const router = express.Router();

router.post('/postCV/:id',  postJobSeekerCV)
router.get('/getSingleCV/:id', getSingleCV)

export default router;