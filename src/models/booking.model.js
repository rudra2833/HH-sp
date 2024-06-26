import mongoose, { Schema } from 'mongoose'

const BookingSchema = new Schema({
    
    provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceinfo',
        required: true,
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    time: {
        type: 'String',
        required: true,
    },

    date: {
        type: 'Date',
        required: true,
    },

    address: {
        type: 'String',
        required: true,
    },

    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending',
        required: true
    },
    
    totalprize: {
        type: Number,
        required: true,
    }

},
    {
        timestamps: true,
    }
);

export const Booking = mongoose.model('Booking', BookingSchema)
