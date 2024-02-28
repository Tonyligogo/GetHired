import Employer from '../models/employer.model.js';
import JobSeeker from '../models/jobSeeker.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const register = async (req, res)=>{
    const{role} = req.body
    try{
        const email = await User.findOne({email:req.body.email})
        if(email) return res.status(409).send('This email already exists!')
        const hash = bcrypt.hashSync(req.body.password, 5)
        const newUser = new User({
            ...req.body,
            password: hash
        })
        await newUser.save();
        if(role === 'Employer'){
            const employer = new Employer({user:newUser._id})
            await employer.save()
        }
        if(role === 'JobSeeker'){
            const jobSeeker = new JobSeeker({user:newUser._id})
            await jobSeeker.save()
        }
        res.status(201).send('User has been created')
    }catch(err){
        res.status(500).send('Something went wrong')
        console.log(err)
    }
}
export const login = async (req, res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user) return res.status(404).send('User not found')
        const isCorrect = bcrypt.compareSync(req.body.password, user.password)
        if(!isCorrect) return res.status(400).send('Wrong username or password')

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_KEY);

        const {password, ...info} = user._doc;
        res.cookie('accessToken',token, {httpOnly: true})
        .status(200).json(info)
    }catch(err){
        res.status(500).send('Something went wrong')
        console.log(err)
    }
}
export const logout = async (req, res)=>{
    res.clearCookie('accessToken',{
        sameSite: 'none',
        secure: true
    })
    .status(200)
    .send('User has been logged out')
}