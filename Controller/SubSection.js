const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// create subSection

exports.createSubSection = async (req, res) => {
    try {
        //fetch data
        const { sectionId, title, timeDuration, description } = req.body
        //extract file/video
        const video = req.files.video
        //validation
        if (!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        //create a sub section
        const subSection = SubSection.create({
            title: title,
            timeDuration: timeDuration,
            Description: description,
            videoUrl: uploadDetails.secure_url
        })
        //update section with this sub section ObejctId 
        const updateSection = await Section.findByIdAndUpdate({ _id: sectionId },
            {
                $push: {
                    subSection: subSection._id
                }
            },
            { new: true }
        ).populate("subSection").exec()

        console.log(updateSection)
        //return res       
        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            updateSection
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create subsection",
            error: error.message
        })
    }
}

//HW updateSubSecion

exports.updateSubSection = async (req, res) =>{
    try {
        //fecth id title description , video url
        const { title, description, videoUrl} = req.body;
        const {subSectionId} = req.params;
        //validatev
        if(!title ||!description ||!videoUrl){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // findByIdAndUpdate
        const subSection = await SubSection.findByIdAndUpdate(subSectionId, 
            {
                $push:{
                    title: title,
                    description: description,
                    videoUrl: videoUrl
                }
            },
            {new: true}
        )
        // return res
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            subSection
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update subsection",
            error: error.message
        })
        
    }
} 

//HW DeleteSubSection
exports.deleteSubSection = async (req, res) =>{
    try {
        const {subSectionId} = req.params
        // validate
        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "Subsection id is required"
            })
        }
        // findByIdAndDelete
      const subSection = await SubSection.findByIdAndDelete(subSectionId)
        // return res
        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            subSection
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to delete subsection",
            error: error.message
        })
    }
} 