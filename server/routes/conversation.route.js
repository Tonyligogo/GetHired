import express from 'express';
import { createConversation, getConversations, getSingleConversation, updateConversation } from '../controllers/conversation.controller.js';

const router = express.Router();

router.get('/getConversations/:id', getConversations);
router.post('/createConversation/:employerId/with/:jobSeekerId', createConversation);
router.get('/singleConversation/:id', getSingleConversation);
router.put('/updateConversation/:id', updateConversation);


export default router;