import express from 'express';
import { createPost  } from '../controllers/post.controller.js'
import { getEmployerData} from '../controllers/employer.controller.js';

const router = express.Router();

router.post('/createPost/:id', createPost)
router.get('/getEmployerData/:id', getEmployerData)



export default router;