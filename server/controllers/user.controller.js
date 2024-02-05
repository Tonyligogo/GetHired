import GoogleUser from '../models/googleUser.model.js';

export const googleUser = async (req, res)=>{
    const {email, username} = await req.body;
    try {
        const newGoogleUser = new GoogleUser({
            email,
            username
        })
        await newGoogleUser.save();
        res.status(201).send('User has been created')
    } catch (error) {
        console.log(error, 'this is my error')
    }
}