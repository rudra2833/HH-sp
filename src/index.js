// require('dotenv').config({path: './env'});
// use to share .env file to all the files during the run
// for using import u have to go in jason->scripts and add "-r dotenv/config<THIS WILL ALSO LOAD .ENV FILE AT RUN> --experimental-json-modules"
// i.e. "nodemon src/index.js" to the above
import dotenv from "dotenv"
dotenv.config({path:"./env"});


import mongoose from "mongoose";
//importing the database name which we want to create from constant.js
import { DB_NAME } from "./constant.js";
//importing the mongodb connection constant variable from db
import connectDB from "./db/db_index.js";
import { app } from "./app.js";


// ++++DASHBOARD+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { spLogin, spLogout, spLoggedIn, ensureAuthenticated, spdashboard} from "./controllers/sp.controller.js";
// for GETing the HOME page
app.get("/sp",(req,res)=>{
    res.render("login.ejs");
})

// when user logins
app.post("/sp", spLogin);

// when clicks login when comes
app.get("/sp/dashboard", ensureAuthenticated, async (req, res) => {
    if (req.isAuthenticated) {
        spdashboard(res,spLoggedIn);
    } else {
        res.render("login.ejs");
    }
});


// when user logout
// do this action at the user profile
app.post("/sp/logout", spLogout);



// ++++DASHBOARD+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { spprofile , spprofileEdit ,spcp ,spcpEdit ,spavail , spavailEdit, spbookingRequest} from "./controllers/sp.controller.js";

//showing the profile
app.get("/sp/profile", async (req, res) => {
    spprofile(res,spLoggedIn);
});

//edfiting the profile
app.post("/sp/profile/submit",spprofileEdit);


//showing the charges and pincodes
app.get("/sp/charges&pincodes", async (req, res) => {
    spcp(res,spLoggedIn);
});

//edfiting the CHARGES AND PINCODES
app.post("/sp/charges&pincodes/submit",spcpEdit);


//showing the availablity
app.get("/sp/availability", async (req, res) => {
    spavail(res,spLoggedIn);
});

//edfiting the availablity
app.post("/sp/availability/submit",spavailEdit);


//shoing new requests
app.get("/sp/newrequest", async (req, res) => {
    spbookingRequest(res,spLoggedIn);
});

// to update the request
import{spbookingRequestupdate} from "./controllers/sp.controller.js";

app.post("/sp/updateRequest", async (req,res)=>{
    spbookingRequestupdate(req,res,spLoggedIn);
})



//calling the function 
connectDB()
.then(() => {
    //it is just server port listing code
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })

}).catch((err) => {
    console.log("MongoDB Connection function call error")
});


