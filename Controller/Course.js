const Course = require("../models/Course")
const User = require("../models/User")
const Tags = require("../models/Tags")
const { uploadImageToCloudinary } = require("../utils/imageUploader")


exports.createCourse = async (req, res) => {
    try {
        //fetch data from
        const { courseName, courseDescription, whatYouWillLearn, price, tags } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation 
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tags) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            })
        }
        //check for instructor
        const userId = req.user.id;
        const instructor = await User.findById(userId);
        console.log("Instructot Details", instructor)
        //TODO: 

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "instructior not found",
            })
        }



        //check given tag is valid or not
        const tagDetails = await Tags.findById(tags);
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Invalid tag",
            })
        }
        //upload 
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create entry in for new Course
        const NewCourse = new Course({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnailImage: thumbnailImage.secure_url,
            instructorId: instructor._id,
            tags: tagDetails._id
        })

        //add the new course to the user schema  instructor

        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: NewCourse._id,
                }
            },
            { new: true },
        )

        // update the tag  ka Schema
        await Tags.findByIdAndUpdate(
            { _id: tagDetails._id },
            {
                $push: {
                    tags: tagDetails._id,
                }
            },
            { new: true },
        )

        // return res
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            course: NewCourse
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        })
    }
}

//getAllCoures handler Fucntion

exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await await Course.find({}, {
            courseName: true,
            studentsEnrolled: true,   
            ratingAndReviews: true,
            price: true,
            thumbnail: true,
            instructor: true  
        }).populate("instructor").exec();


        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            courses: allCourses
        })
         
    } catch (error) {
        //res 
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all courses",
            error: error.message
        })
    }
}


//Section SubSection 