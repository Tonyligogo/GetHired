import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res)=>{
    try{
        const email = await User.findOne({email:req.body.email})
        if(email) return res.status(409).send('This email already exists!')
        const hash = bcrypt.hashSync(req.body.password, 5)
        const newUser = new User({
            ...req.body,
            password: hash
        })
        await newUser.save();
        res.status(201).send('User has been created')
    }catch(err){
        res.status(500).send('Something went wrong')
    }
}
export const login = async (req, res)=>{
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user) return res.status(404).send('User not found')
        const isCorrect = bcrypt.compareSync(req.body.password, user.password)
        if(!isCorrect) return res.status(400).send('Wrong username or password')

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_KEY)

        const {username, _id} = user._doc;
        res.cookie('accessToken', token, {
            httpOnly: true 
        }).status(200).json({username, _id})
    }catch(err){
        res.status(500).send('Something went wrong')
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