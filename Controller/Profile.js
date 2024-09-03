const Profile = require("../models/Profile");
const ProfileSchema = require("../models/Profile")
const User = require("../models/User")

exports.updateProfile = async (req, res) => {
    try {
        
        //get data
        const {userId,  dateOfBirth ="", about ="", contactNumber, gender} =  req.body;
        //userid
        const id = req.user.id
        //validation 
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //find profile
        const userDetails = User.findById(id);
        const profileID = userDetails.additional;
        const profileDetails = await Profile.findById(profileID);

        //update profile 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        await profileDetails.save()
        //return res
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })
    } catch (error) {
        console.error("Error in updateProfile: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
}

// deleteAccout
//Explore Crone Job

exports.deleteAccount = async(req, res) =>{
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        //delete Profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
        //delete user
        //TODO: HW unenroll user form all enrolled course 
        //user delete
        await User.findByIdAndDelete(id);
        //return res
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })
    } catch (error) {
        console.error("Error in deleteAccount: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
}

//get Details

exports.getAllUserDetails = async (req, res) =>{
    try {
        //get id
        const id = req.user.id;
        //get user details and validation
        const userDetails = await User.findById(id).populate("additionalDetais").exec();
        //res
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails
        })
    } catch (error) {
        console.error("Error in getAllUserDetails: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}