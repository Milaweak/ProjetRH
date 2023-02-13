const express = require('express');
const mongoose = require ('mongoose');
const session = require('express-session')

const RHRouter = require('./routes/RHRouter.js')

const app = express()


app.use(express.static('assets'))
app.use(session({secret: "secret", saveUninitialized: true,resave: true}));
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(RHRouter);


mongoose.set('strictQuery', false);
const db = BDD_URL ;
mongoose.connect(db)

mongoose.connect(db, (err)=> {
if(err){
    console.log(err);
}else{
    console.log("Connected to DataBase");
}
})


app.listen(3001,(err)=> {
    if (err) {
    console.log(err);}
    else{
    console.log('Connected to server');
    }
    })
