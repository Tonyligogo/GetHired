import express from 'express';
import { CheckPaymentStatus, MpesaCallBack, STKPush } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/',  STKPush)
router.post('/callback',  MpesaCallBack)
router.post('/checkStatus', CheckPaymentStatus)


export default router;