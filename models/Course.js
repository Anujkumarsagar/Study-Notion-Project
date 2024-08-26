const mongoose = require("mongoose")

const courseSchema = mongoose.Schema({
    courseName:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    courseDescription:{
        type: String,
        required: true,
        minlength: 20,
        maxlength: 500
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn:{
        type: String,
       
    },
    courseContent: [
        {
            type: String,
            ref:"Section"
        }
    ],
    ratingAndReview:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    price:{
        type: Number,
        required: true,
        min: 0
    },
    thumbnail:{
        type: String,
        required: true
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },
    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ]

});

module.exports = mongoose.model("Course",courseSchema)