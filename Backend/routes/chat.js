import express from "express";
import Thread from "../models/Thread.js";
import getOpenAiResponse from "../utils/openai.js"
const router = express.Router();
const MAX_MESSAGE_LENGTH = 4000;


//GET all thread
router.get("/thread" , async(req,res)=>{
    try{
        //descending order ..most recent data at top
        const allThread = await Thread.find({}).sort({updatedAt:-1});
        
        res.json(allThread);
    }catch(err){
        console.log(err);
        res.status(500).json({err : "failed to find allThreads"});
        return;
    }
    
})

//GET for specific thread
router.get("/thread/:threadId" , async (req,res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({err : "Chat not found"});
            return;
        }
        res.json(thread);
    }catch(err){
        console.log(err);
        res.status(500).json({err : "failed to find Threads"});
        return;
    }
    
})

//delete 
router.delete("/thread/:threadId" , async (req,res)=>{
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({err : "Thread not found"});
            return;
        }
        res.status(200).json({success : "Thread deleted successfully"});

    }catch(err){
        // console.log(err);
        res.status(500).json({err : "failed to delete Threads"});
        
    }
})

//post route 
router.post("/chat" , async (req,res)=>{

    let {threadId , message} = req.body;
    
    //if threadid and message is empty
    if(!threadId || typeof threadId !== "string" || typeof message !== "string"){
        res.status(400).json({err : "missing required field"});
        return;
    }
    message = message.trim();
    if(message.length === 0){
        res.status(400).json({err : "Message cannot be empty"});
        return;
    }
    if(message.length > MAX_MESSAGE_LENGTH){
        res.status(400).json({err : `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`});
        return;
    }
    
    try{
        //check id threadId is is db or not
        let thread = await Thread.findOne({threadId});

        if(!thread){ //means it is new chat
            //create new thread in db
            thread = new Thread({
                threadId ,
                title : message,
                messages : [{
                    role : "user",
                    content : message
                }]
            })

        }else{
            //already thread exists
            thread.messages.push({role : "user",content : message})
        }

        //get reply from assistant
        const assistantReply = await getOpenAiResponse(message);
        thread.messages.push({role : "assistant",content : assistantReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply : assistantReply});
    }catch(err){
        console.log(err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({err : statusCode === 502 ? "AI provider is unavailable" : "something went wrong"});
        return;
    }
})

export default router;