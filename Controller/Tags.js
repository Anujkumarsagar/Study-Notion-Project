const Tag = require("../models/Tags")

exports.createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //create entr in DB

        const tagDetails = await Tag.create({
            name: name,
            description: description
        })

        console.log(tagDetails)


        //res 

        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
            data: tagDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//getAllTags handler function

exports.showAlltags = async (req, res) => {
     try {
        const allTags = await Tag.find({}, { name: true, description: true })

        //return res
        return res.status(200).json({
            success: true,
            message: "All tags fetched successfully",
            data: allTags
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 
