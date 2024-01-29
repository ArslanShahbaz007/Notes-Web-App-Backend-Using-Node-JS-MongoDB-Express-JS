const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const JWT_secret = "alskndmascbjkidhlksan";
const fetchuser = require('../middleware/fetchuser');

//create user endpoint
router.post('/createuser',async (req,res)=>{
    // console.log(req.body);
    // res.send(req.body);
    let success = false;
    const salt = await bcrypt.genSalt(10);
    const securepass= await bcrypt.hash(req.body.password,salt);
    let useremail = await User.findOne({email: req.body.email});
    let user;
    if(useremail){
        return res.status(400).json({error: "Sorry a user with this email already exist", success});
    }else{
            user = await User.create({
            name: req.body.name,
            password: securepass,
            email: req.body.email,
        });
         
    }
    const data = {
        user:{
        id: user.id,
        }
    }
    const authtoken = jwt.sign(data,JWT_secret);
    success = true;
    res.json({success, authtoken});
    
})

//login endpoint
router.post('/login',async (req,res)=>{

     const {email, password} =  req.body;
     let success = true;
    try{
        let user = await User.findOne({email});
        if(!user){
            success=false;
            return res.json(success);
        }
        
        const passwordcompare = await bcrypt.compare(password, user.password);
        if(!passwordcompare){
            success=false;
            return res.json(success);
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_secret);
        // console.log(authtoken);
        res.json({success, authtoken});

    }catch(error)
    {
        success=false;
        res.json(success);
        
    }


})

// endpoint to get details of user logged in 
router.post('/getuser', fetchuser, async (req,res)=>{
    try{
       let userid=req.user.id;
        const user = await User.findById(userid).select("-password");
        console.log(user);
        res.send(user);
    }catch(error){
        res.status(500).send("Some Error Occured");
    }

})



module.exports = router;
