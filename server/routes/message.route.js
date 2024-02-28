import express from 'express';
import { createMessage, getAllMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/allMessages/:id', getAllMessages);
router.post('/:employerId/with/:jobSeekerId', createMessage);

export default router;