import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from  'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Sequelize, where } from "sequelize";
import dotenv, { config } from 'dotenv';


//here again we define the doenv

dotenv.config();

    export const signup = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    try{
        const user = await User.findOne({where: {email}});
        if(user) {
            return res.status(400).json({message:'email already exists'});

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = await User.create({
            firstName, 
            lastName, 
            email,
            paasword: hashedPassword,

        });

        const payload = {id: newUser.id};
        const token = jwt.sign(payload, process.env.JWT_SECRET , {
            expiresIn: "1h" })

            res.status(201).json({token});
        } catch (error) {
            res.status(500).json({message: "server error  " + error.message })
        };
        
    }

    export const login = async (req , res) => {
        const {email, password} = req.body;

        try{
            const user = await User.findOne({where: {email}});
            if(!user) {
                return res.status(400).json({message: "invalid crednetials"});

            }
            const isMatch =  await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({message: 'invalid crednetials'});
            }
            const payload = {id: user.id};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'});


                res.json({token});

        } catch (error) {
            res.status(500).json({message: 'server error' + error.message});

        }
    }

    // this is for the user detials

    export const  getUser = async (req, res) => {
        try{
            const user = await User.findByPk(req.user.id, {
                attributes: {exclude:  ['password', 'resetToken', 'resetTokenExpiry']},

            })

            if(!user) {
                return res.status(404).json({message: 'user not found'});

            }
            res.json(user);

        } catch (error) {
            res.status(500).json({message: 'server error:' + error.message});


        }
    }

    export const forgotpassword = async(req, res) => {
        const {email} = req.body;

        try{
            const user = await User.findOne({where: {email}});
            if(!user){
                return res.status(404).json({message:'email not found'})

            }
            const resetToken = jwt.sign({id: user.id},
                process.env.JWT_SECRET, {expiresIn: '5m'})
                await user.update({
                    resetToken,
                    resetTokenExpiry: Date.now() + 5 * 60 * 1000,})

                    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`
                    console.log('generated reset link', resetLink);
                    
                    const  transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,

                        }
                    })

                    const mailOptions = {
                        from: `'hitesh kushwah' <${process.env.EMAIL_USER}`,
                        to: email,

                        subject: 'password reset request',
                        html: `hello ${user.firstName}, <br> Click <a> href="${resetLink}"> here </a> to reset your password. link expires in 5 minutes`,



                    }
                    await transporter.sendMail(mailOptions);
                    console.log(`reset email sent to: ${email}`) ;



                    res.json({message: 'reset link sent to email'});


                 
        }
        catch(error){

        console.error('email  error:', error);
        res.status(500).json({message:'server errpr'} + error.message)
      }

    }

        
         
        export const resetPassword = async (req, res) => {
            const {token, newPassword, confirmPassowrd} = req.body;

            if(newPassword != confirmPassowrd)
            {
                return res.status(400).json({message: 'passwords not match'})
            }

            try{
                const decoded =  jwt.verify(token, process.env.JWT_SECRET);

                const user = await User.findOne({
                    where: {
                        id: decoded.id,
                        resetToken: token,
                        resetTokenExpiry: {[Sequelize.op.gt]: Date.now()},

                    },
                });

                if(!user) {
                    return res.status(400).json({message: "invalod or expired token"})
                }
                 const salt = await bcrypt.genSalt(10);
                 const hashedPassword = await bcrypt.hash(newPassword, salt);

                 await user.update({
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiry: null,

                 })

                 res.json({message: "password reset succesfully"});

            } catch (error) {
                res.status(500).json({message: 'server error' + error.message})
            }

    }

