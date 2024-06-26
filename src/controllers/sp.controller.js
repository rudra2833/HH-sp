import { ServiceInfo } from "../models/serviceprovider.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from '../utils/APIResponse.js';
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import moment from "moment";
import e from "express";

let spLoggedIn = null;

const spLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        throw new ApiError(400, "username or password is required");
    }

    const sp = await ServiceInfo.findOne({ email });

    if (!sp) {
        throw new ApiError(404, "User does not exist");
    }

    //change the below line
    if(sp.password !== password){
        throw new ApiError(401, "Password is incorrect");
    }

    // const isPasswordValid = await sp.isPasswordCorrect(password);
    // if (!isPasswordValid) {
    //     throw new ApiError(401, "Password is incorrect");
    // }

    spLoggedIn = sp._id;
    
    console.log("User logged-in successfully!!");
    res.redirect("/sp/dashboard");
});

const ensureAuthenticated = (req, res, next) => {
    if (spLoggedIn) {
        req.isAuthenticated = true;
    } else {
        req.isAuthenticated = false;
    }
    next();
};

const spdashboard = async (res,spLoggedIn) => {
    const sp = await ServiceInfo.findById(spLoggedIn).select('spid providername email phoneno avatar category');
    console.log(sp);

    res.render("mainpackets.ejs", { db: sp });
};

const spLogout = asyncHandler(async (req, res) => {
    spLoggedIn = null;
    console.log("User logged out successfully!!");
    res.redirect("/sp");
});


const spprofile = async (res,spLoggedIn) => {
    const sp = await ServiceInfo.findById(spLoggedIn).select('spid providername email phoneno avatar category');
    console.log(sp);

    res.render("profile.ejs", { db: sp });
};


const spprofileEdit = asyncHandler(async (req, res) => {
    const {email, phoneno } = req.body;

    if ([ email, phoneno].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "ALL fields are required");
    }

    const {password} = req.body;
    const user = await ServiceInfo.findById(spLoggedIn);
    
    if(password === "*********"){
        user.email = email;
        user.phoneno = phoneno;
    }else{
        user.fullname = fullname;
        user.email = email;
        user.phoneno = phoneno;
        user.password = password;
    }
    await user.save();
    console.log("Service Provider profile updated successfully!!");
    res.redirect("/sp/dashboard");
});


const spcp = async (res,spLoggedIn) => {
    const sp = await ServiceInfo.findById(spLoggedIn).select('spid providername email phoneno avatar category charges pincodes');
    console.log(sp);

    res.render("charges&pincodes.ejs", { db: sp });
};


const spcpEdit = asyncHandler(async (req, res) => {
    const { charges, pincodes } = req.body;

    //here
    const pincodesarr = pincodes.split(',').map(pin => pin.trim());
    // console.log(pincodesarr);
    
    try {
        const user = await ServiceInfo.findById(spLoggedIn);
        console.log(user);
        
        user.charges = charges;
        user.pincodes = pincodesarr;
    
        await user.save();
        console.log("Service Provider details updated successfully!!");
        res.redirect("/sp/dashboard");

    } catch (error) {
        console.error("Error in update:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


const spavail = async (res,spLoggedIn) => {
    const sp = await ServiceInfo.findById(spLoggedIn).select('spid providername email phoneno avatar category availability');
    console.log(sp);

    res.render("availability.ejs", { db: sp });
};


const spavailEdit = asyncHandler(async (req, res) => {
    const { availability } = req.body;
    
    try {
        const user = await ServiceInfo.findById(spLoggedIn);
        
        user.availability = availability;

        await user.save();
        console.log("Service Provider details updated successfully!!");
        res.redirect("/sp/dashboard");

    } catch (error) {
        console.error("Error in update:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


const spbookingRequest = async (res,spLoggedIn) => {
    try {
        console.log(spLoggedIn);
        const sp = await ServiceInfo.findById(spLoggedIn).select('spid providername email phoneno avatar category availability');

        const bookingrequest = await Booking.find({provider_id: spLoggedIn, status: "pending"});

        const formattedResult = bookingrequest.map(item => {

            const v1 = new Date(item.date).toDateString();
            const datearray = v1.split(" ");
            var date="";
            for (let i = 0; i < 4; i++) {
                
                date = datearray[i] + " " + date;
                
            }

            return {
                ...item.toObject(),
                changedate: date
            };
        });

        console.log(formattedResult);

        res.render("bookingrequest.ejs", { db: sp , brdb: formattedResult});
        // const result = await Booking.findById(spLoggedIn).find({status :"pending"});
        // res.render("bookingrequest.ejs", { db: result });
      } catch (error) {
        console.error("Error submitting the Request:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
};


const spbookingRequestupdate  = asyncHandler(async (req, res) => {
    const { customerId, id, action } = req.body;

    const customerdetails = await User.findById(customerId).select('username email phoneno');

    //HERE SENDING THE EMAIL FOR THE SAME

  try {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    await Booking.findByIdAndUpdate(id, { status: status });
    res.redirect("/sp/newrequest");

  } catch (error) {
    console.error("Error updating the Request:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export {spLogin, spLogout, spLoggedIn, ensureAuthenticated, spdashboard , spprofile , spprofileEdit,spcp ,spcpEdit,spavail , spavailEdit, spbookingRequest }
export {spbookingRequestupdate}