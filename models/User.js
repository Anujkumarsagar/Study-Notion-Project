const mongoose = require("mongoose")

const userShema = mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        trim: true,
    },
    lastname:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
       
    },
    password:{
        type: String,
        required: true,
       
    },
    token : {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    phoneNumber:{
        type: Number,
        required: true,
        unique: true,
    },
    accountType:{
        type: String,
        required: true,
        enum: ['Admin', 'Student', "Instructor"]
    },

    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId, //for refernce,
        required: true,
        ref: "Profile",
    },
    courses: [
        {type: mongoose.Schema.Types.ObjectId, //for refernce,
       ref: "Course"}
    ],
    image:{
        type: String,
        required: true,
    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId, //for refernce,
        ref: "CourseProgress"
    }]

})

module.exports = mongoose.model("User", userShema)