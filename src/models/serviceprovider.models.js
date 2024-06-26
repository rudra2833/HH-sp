import mongoose, { Schema } from "mongoose";


const review = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    rating: {
        type: Number, // Assuming rating will be a number
        required: true,
        min: 1, // Minimum rating value
        max: 5, // Maximum rating value
    },
    message: {
        type: String,
        required: true,
    }
})

const book = new Schema({
    timeslot: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    }
});


// create a pipeline
const pastbooks = new Schema({
    
    bookingid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
},
    {
        timestamps: true,
    }
);

const serviceInfo = new Schema({

    spid:{
        type: String,
        required: true,
    },

    providername: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    //this is unique
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    phoneno: {
        type: String,
        required: true,
        trim: true,
    },

    adharno: {
        type: String,
        required: true,
        trim: true,
    },

    birthday: {
        type: Date,
        required: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    category: {
        type: String,
        required: true,
    },

    charges: {
        type: Number,
        required: true,
        trim: true,
    },

    // create a pipe line for that
    // or edit it when anyone rates the provider
    rating: {
        type: Number, // Assuming rating will be a number
        default: 0,
        max: 5, // Maximum rating value
    },

    availability: {
        type: Boolean,
        required: true,
    },

    city: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    reviewers: {
        type: [review],
    },

    pincodes: {
        type: [String],
        required: true,
    },

    avatar:{
        type:String,  //cloudinary url
    },

    slot: {
        type: [book],
        required: true,
        default: [
            { timeslot: "Morning", status: true },
            { timeslot: "Afternoon", status: true },
            { timeslot: "Evening", status: true },
            { timeslot: "Night", status: true }
        ]
    },

    pastBooking: {
        type: [pastbooks],
    }

}, {
    timestamps: true,
})



// serviceInfo.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
    
//     this.password = await bcrypt.hash(this.password, 10)
   
//     next()
// })

// serviceInfo.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password)
// }


export const ServiceInfo = mongoose.model('serviceinfo', serviceInfo);





// app.get('/download', async (req, res) => {
//     const jsonData = await ServiceInfo.find().lean().select("providername email phoneno adharno birthday category charges rating availability city pincodes"); // Fetch data from MongoDB
//     console.log(jsonData);
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    
//     fastCsv
//     .write(jsonData, { headers: true })
//     .pipe(res);
// });
