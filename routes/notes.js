const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');


//Route for getting all the notes
router.get('/fetchallnotes', fetchuser , async (req, res)=>{
    try{
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    }catch(error){
        res.status(500).send("Some Error Occured");
    }
})

//route for adding a note
router.post('/addnote', fetchuser , async (req, res)=>{
    try{
        const{title, description, tag} = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id,
        })
        const savednotes = await note.save();
        res.json(savednotes);
    }
    catch(error){
        res.status(500).send("Some Error Occured");
    }
})


//route for updating notes
router.put('/updatenote/:id', fetchuser , async (req, res)=>{
    try{
        const {title, description, tag}= req.body;
        const newnote = {};
        if(title){newnote.title = title};
        if(description){newnote.description = description};
        if(tag){newnote.tag = tag};

        let note = await Notes.findById(req.params.id);

        if(!note){
          return  res.status(404).send("Not found");
        }

        if(note.user.toString() != req.user.id)
        {
          return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newnote}, {new:true});
        res.json({note});

    }
    catch(error){
        res.status(500).send("Some Error Occured");
    }
})


//route for deleting a note
router.delete('/deletenote/:id', fetchuser , async (req, res)=>{
    try{
        let note = await Notes.findById(req.params.id);

        if(!note){
          return  res.status(404).send("Not found");
        }

        if(note.user.toString() != req.user.id)
        {
          return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json("Success");

    }
    catch(error){
        res.status(500).send("Some Error Occured");
    }
})




module.exports = router;
