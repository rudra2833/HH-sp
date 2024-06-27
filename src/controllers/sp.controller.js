import { ServiceInfo } from "../models/serviceprovider.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from '../utils/APIResponse.js';
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import moment from "moment";
import nodemailer from "nodemailer";

let spLoggedIn = null;

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `"Helper Hand" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
};

const reqAcceptedMail = async (user, serviceProvider,bookingtab)=>{
    // Send email to user
    // const userEmail = user.email;
    const userEmail = "monkeydluffy1483@gmail.com";
    const userSubject = "Your Service Request has been Accepted!";
    const userHtml = `<p style="color: black;">Dear <strong>${user.username}</strong>,</p>
    <h1>Your request has been Accepted</h1>
    <p>
    We are excited to inform you that your service request with Helper's Hand has been accepted by one of our trusted service providers!<br>
    Booking Confirmation Details:
    <br>
    Service: <strong>${serviceProvider.category}</strong>
    <br>
    Service Provider Name: <strong>${serviceProvider.providername}</strong>
    <br>
    Date: <strong>${bookingtab.date}</strong>
    <br>
    Time: <strong>${bookingtab.time}</strong>
    <br>
    Address: <strong>${bookingtab.address}</strong>
    <br>
    Service Provider PhoneNumber: <strong>${serviceProvider.phoneno}</strong>
    <br>
    <br>
    Important Information:<br>
    Arrival: The service provider will arrive at your location at the scheduled time.<br>
    Communication: If you need to reschedule or have any questions, you can contact the service provider directly or reach out to our customer support.<br>
    Payment: Please be prepared to make payment as per the agreed terms after the completion of the service.<br>
    Feedback: Your feedback is important to us. After the service is completed, you will rate service provider in our website.<br>
    <br>
    <br>
    We appreciate your trust in our services and are committed to delivering the best experience possible.
    </p>
    <p style="color: black;">
    Thank you once again for choosing Helper's Hand. We look forward to serving you!
    <br><br>
    Best regards,
    <br>
    Helper's Hand
    </p>`;
    await sendEmail(userEmail, userSubject, userHtml);

    // Send email to service provider
    // const providerEmail = serviceProvider.email;
    const providerEmail = "rudrapatel2833@gmail.com";
    const providerSubject = "Service Request Accepted - Next Steps";
    const providerHtml = `<p>Dear ${serviceProvider.providername},</p>
    <h1>You have Accepted the Service Request</h1>
    <p>
    Thank you for accepting the service request through Helper's Hand. We appreciate your prompt response and are excited for you to assist our customer.
    <br>
    Booking Details:
    <br>
    Service Date: <strong>${bookingtab.date}</strong>
    <br>
    Service Time: <strong>${bookingtab.time}</strong>
    <br>
    Service Address: <strong>${bookingtab.address}</strong>
    <br>
    Customer Name: <strong>${user.username}</strong>
    <br>
    Customer Phoneno: <strong>${user.phoneno}</strong>
    <br>
    <br>
    Next Steps:<br>
    Preparation: Ensure you have all necessary tools and materials required for the service.<br>
    Punctuality: Please arrive at the customer's location on time.<br>
    Communication: Contact the customer to confirm the details and address any initial questions or special instructions they might have.<br>
    Professionalism: Provide excellent service and maintain a professional demeanor.<br>
    <br>
    Thank you for your commitment to providing excellent service and for being a valued partner of Helper's Hand.
    <br>
    Best regards,
    </p>
    <p>Should you have any questions or require additional information regarding this booking, 
    please do not hesitate to contact our support team at helpershand506219@gmail.com.</p>`;
    await sendEmail(providerEmail, providerSubject, providerHtml);
}

const reqRejectedMail = async (user, serviceProvider,bookingtab)=>{
    // Send email to user
    // const userEmail = user.email;
    const userEmail = "monkeydluffy1483@gmail.com";
    const userSubject = "Your Service Request has been Rejected!";
    const userHtml = `<p style="color: black;">Dear <strong>${user.username}</strong>,</p>
    <h1>Your request has been Rejected</h1>
    <p>
    We regret to inform you that your service request with Helper's Hand has been 
    declined by our service providers. We understand this might be 
    disappointing and sincerely apologize for any inconvenience this may cause.<br>
    Booking Details:
    <br>
    Service: <strong>${serviceProvider.category}</strong>
    <br>
    Service Provider Name: <strong>${serviceProvider.providername}</strong>
    <br>
    Date: <strong>${bookingtab.date}</strong>
    <br>
    Time: <strong>${bookingtab.time}</strong>
    <br>
    Address: <strong>${bookingtab.address}</strong>
    <br>
    Service Provider PhoneNumber: <strong>${serviceProvider.phoneno}</strong>
    <br>
    <br>
    If you have any questions or need further assistance, please feel free to contact us at helpershand506219@gmail.com.<br>
    </p>
    <p style="color: black;">
    Thank you once again for choosing Helper's Hand. We look forward to serving you!
    <br><br>
    Best regards,
    <br>
    Helper's Hand
    </p>`;
    await sendEmail(userEmail, userSubject, userHtml);
}


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



const spbookingRequestupdate  = async (req, res, spLoggedIn) => {
    const { customerId, id, action } = req.body;

    const bookingtab = await Booking.findById(id);
    const user = await User.findById(customerId).select('username email phoneno');
    const serviceProvider = await ServiceInfo.findById(spLoggedIn).select('providername category phoneno');

    //HERE SENDING THE EMAIL FOR THE SAME
  try {
    const status = action === 'accept' ? 'accepted' : 'rejected';

    //sending mail if status accepted
    if(status === 'accepted'){
        reqAcceptedMail(user, serviceProvider,bookingtab);

    }else{
        reqRejectedMail(user, serviceProvider,bookingtab);
    }

    await Booking.findByIdAndUpdate(id, { status: status });
    res.redirect("/sp/newrequest");

  } catch (error) {
    console.error("Error updating the Request:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


export {spLogin, spLogout, spLoggedIn, ensureAuthenticated, spdashboard , spprofile , spprofileEdit,spcp ,spcpEdit,spavail , spavailEdit, spbookingRequest }
export {spbookingRequestupdate}