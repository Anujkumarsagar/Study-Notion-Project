const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try {

        //data fetch
        const { sectionName, courseId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //create section
        const newSection = await Section.create({
            sectionName
        })
        //update course with section Object ID
        const updateCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true }
        ).populate({
            path: 'courseContent',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: 'subSection' }
        }).exec();

        console.log(updateCourse)



        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            section: newSection,
            course: updateCourse
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: error.message
        })
    }
}

//updateSection

exports.updateSection = async (req, res) => {
    try {
        //fetch data 
        const { sectionName, sectionId } = req.body
        //vaidation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //update data
        const updatedSection = await Course.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );
        console.log(updatedSection)
        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection: updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: error.message
        })
    }
}

//deleteSection
exports.deleteSection = async (req, res) => {
    try {
        //fetch id from params (link)
        const {sectionId} = req.params

        const DeletedSection = await Section.findByIdAndDelete(sectionId)
        console.log(DeletedSection);

        //TODO: do we need to delete id from the course schema
        

        //return res
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            deletedSection: DeletedSection,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to deleted section",
            error: error.message
        })
    }
}
