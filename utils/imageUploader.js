const cloudinary = require("cloudinary").v2

exports.uploadImageToCloudinary = async(req, res) => {
   try {
    const options = {folder}
    if(height) {
        options.height = height
    }
    
    if(quality){
        options.quality = quality
    }
    options.resource_type = "auto"
    const result = await cloudinary.uploader.upload(req.tempFilePath, options)
    return result
   } catch (error) {
    
    return res.status(500).json({
        success: false,
        message: "Error uploading image to cloudinary",
        error: error.message
    })
   }
}