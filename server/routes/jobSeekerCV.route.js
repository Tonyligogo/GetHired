import express from 'express';
import {uploads} from '../multer.js'
import { postJobSeekerCV } from '../controllers/jobSeeker.controller.js'

const router = express.Router();

router.post('/postCV/:id',  postJobSeekerCV)


export default router;