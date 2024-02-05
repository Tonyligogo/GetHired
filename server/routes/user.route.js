import express from 'express';
import {googleUser} from "../controllers/user.controller.js"

const router = express.Router();

router.post('/googleUser', googleUser)

export default router;