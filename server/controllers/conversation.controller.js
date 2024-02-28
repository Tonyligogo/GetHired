import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js"

export const createConversation = async (req, res, next)=>{
    const{employerId, jobSeekerId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(employerId) || !mongoose.Types.ObjectId.isValid(jobSeekerId)) {
        return res.status(400).json({ error: 'Invalid employerId or jobSeekerId' });
    }
    const employerObjectId = new mongoose.Types.ObjectId(employerId);
    const jobSeekerObjectId = new mongoose.Types.ObjectId(jobSeekerId);

    const newConversation = new Conversation({
        id:employerId + jobSeekerId,
        employerId:employerObjectId,
        jobSeekerId:jobSeekerObjectId,
        readByEmployer:true,
        readByJobSeeker:false
    })
    try {
        const existingConversation = await Conversation.findOne({
            id:employerId + jobSeekerId
        });

        // If an existing conversation is found, return it
        if (existingConversation) {
            return res.status(200).json(
                existingConversation
            );
        }
        const saveConversation = await newConversation.save();
        return res.status(201).json(saveConversation);
    } catch (error) {
        next(error)
    }
}
export const getConversations = async (req, res, next)=>{
    try {
        // const conversations = await Conversation.find({ $or:[{employerId:req.params.id}, {jobSeekerId:req.params.id}] })
        // .populate({ path: "employerId", options: { strictPopulate: false } })
        // .populate({ path: "jobSeekerId", options: { strictPopulate: false } })
        // .sort({updatedAt: -1})
        let conversations = await Conversation.find({ employerId: req.params.id })
        .populate({ path: "jobSeekerId", options: { strictPopulate: false } })
        .sort({ updatedAt: -1 });

    // If no conversations found for employerId, try fetching by jobSeekerId
    if (conversations.length === 0) {
        conversations = await Conversation.find({ jobSeekerId: req.params.id })
            .populate({ path: "employerId", options: { strictPopulate: false } })
            .sort({ updatedAt: -1 });
    }
    if (conversations.length === 0) {
        return res.status(404).json({ message: 'No conversations found for the user' });
    }
    return res.status(201).json(conversations);
    } catch (error) {
        next(error)
    }
}
export const getSingleConversation = async (req, res, next)=>{
    try {
        const conversation = await Conversation.findOne({id:req.params.id});
        if(!conversation){
            return res.status(404).send('This conversation does not exist')
        } 
        return res.status(201).json(conversation);
    } catch (error) {
        next(error)
    }
}
export const updateConversation = async (req, res, next)=>{
    try {
        const updatedConversation = await Conversation.findOneAndUpdate({id:req.params.id},{
            $set:{readByEmployer:true, readByJobSeeker:true},
        },
        {new: true}
        );
        return res.status(201).json(updatedConversation);
    } catch (error) {
        next(error)
    }
}
