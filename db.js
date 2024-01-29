const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/mynotes";

async function connecttomongo() {
    await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
  }
  


module.exports=connecttomongo;