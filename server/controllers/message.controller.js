import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js";

export const createMessage = async (req, res, next)=>{
    const { employerId, jobSeekerId } = req.params;
    const newMessage = new Message({
        conversationId:employerId+jobSeekerId,  //create a unique id for the conversation between two users
        userId: req.body.id,
        content:req.body.content
    })
    try {
        const saveMessage = await newMessage.save();
        await Conversation.findOneAndUpdate({id:req.body.conversationId},{
            $set:{
                lastMessage: req.body.content
            }
        },
        {new: true}
        )
        return res.status(201).json(saveMessage);
    } catch (error) {
        next(error)
    }
}
export const getAllMessages = async (req, res, next)=>{
    try {
        const messages = await Message.find({conversationId: req.params.id})
        return res.status(201).json(messages);
    } catch (error) {
        next(error)
    }
}