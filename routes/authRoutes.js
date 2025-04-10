//now in this we define all the routes here.

import express from 'express';
import {signup, login, getUser, forgotpassword, resetPassword}  from '../controllers/authControllers.js';
import auth from  '../middleware/auth.js' ;

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getUser);
router.post('/forgot-password', forgotpassword);
router.post('/reset-password', resetPassword);

export default router;