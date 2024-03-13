import express from 'express';
import {uploads} from '../multer.js'
import { register, login, logout } from '../controllers/auth.controller.js'

const router = express.Router();

router.post("/register", uploads.single('image'), register)
router.post("/login", login)
router.post("/logout",  logout )

export default router;