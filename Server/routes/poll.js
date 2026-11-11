const express=require('express');
const router=express.Router();
const Poll=require('../models/poll.js');

//GET  /api/polls -get all polls ,new first
router.get('/',async(req,res)=>{
    try {
        const polls=await Poll.find().sort({created_at:-1});
        res.json(polls);
} catch (error) {
    res.status(500).json({ message:'server error', error: error.message });
}
});
//POST /api/polls -create a new poll
router.post('/',async(req,res)=>{
    try {
        const {question,options}=req.body;
        if(!question || !options || options.length<2 ){
            return res.status(400).json({message:'Invalid poll data'});
        }
        const formattedOptions=options.map(option=>({
            text:option.text,
            votes:0
        }));
        const poll=new Poll({question,options});
        await poll.save();
        res.status(201).json(poll);
} catch (error) {
    res.status(500).json({ message:'server error', error: error.message });
}
});
//GET /api/polls/:id -get a single poll by id
router.get('/:id',async(req,res)=>{
    try {
        const poll=await Poll.findById(req.params.id);
        if(!poll){
            return res.status(404).json({message:'Poll not found'});
        }
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message:'server error while fetching poll', error: error.message });
    }
});
//POST /api/polls/:id/vote -submit vote for a poll
router.post('/:id/vote',async(req,res)=>{
    try {
        const {optionIndex}=req.body;
        const poll=await Poll.findById(req.params.id);
        if(!poll){
            return res.status(404).json({message:'Poll not found'});
        }
        if(optionIndex<0 || optionIndex>=poll.options.length){
            return res.status(400).json({message:'Invalid option index'});
        }
        poll.options[optionIndex].votes+=1;
        poll.total_votes+=1;
        await poll.save();
        res.json(poll);
    }catch(error){
        res.status(500).json({ message:'server error while voting', error: error.message });
    }
});
module.exports=router;