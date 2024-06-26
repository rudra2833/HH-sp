import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new Schema({
    address:{
        type: String,
        required: true,
    }    
})

const pastbooks = new Schema({

    bookingid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    },
},{timestamps: true,}
)


const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    
    fullname:{
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    phoneno: {
        type: String,
        trim: true,
    },
    bookings:{
        type: [pastbooks]
    }
},
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10)
   
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema);