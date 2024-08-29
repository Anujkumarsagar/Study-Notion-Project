const User = require("../models/User")
const OTP = require("../models/OTP");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const otp = require("../models/OTP");
const jwt = require("jsonwebtoken")

//sendOTP   
// emai-validate , check kiya ke entry to nahi hai -> agar nahi hai to -> unique otp generate karo -> DB mei store karo -> res true
exports.SendOTP = async (req, res) => {
    try {
        //fetch email from request ki body

        const { email } = req.body;


        //validate email using email-validator npm package

        //check if user already exists
        const checkUserPrsent = await User.findOne(email);
        if (checkUserPrsent) {
            return res.status(400).json({ msg: "Email already exists" })
        }

        //Unique Otp
        const otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialCharacters: false,
        })

        console.lor("the Otp is : ", otp)

        const result = await OTP.findOne({ otp: otp })

        while (result) {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialCharacters: false,
            })
            result = await OTP.findOne({ otp: otp })
        }

        // save it in DB

        const otpPayload = { email, otp }
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody)

        //return response successfull

        res.status(200).json({
            success: true,
            message: "otp saed successfully",
            otp
        })

    } catch (error) {
        console.error("the error in OTP contoller = ", error.message)
    }
}

//signUp
//signup just validate , confirmation , Entry DB mei store karne ke kaam aata hai 
exports.Signup = async (req, res) => {
    try {

        //fetch information form req

        const { firstname, lastname, email, password, confirmPassword, accountType, phoneNumber, otp } = req.body;

        //validate email ,password (wit reenterend password)

        if (!firstname || !lastname || !email || !password || !confirmPassword || !otp || !phoneNumber || !accountType) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"

            })
        }

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }


        // check user already exist or not
        if (await User.findOne(email)) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        // OTP confirmation -> find most recent otp stored for the user
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp)

        //validate OTP
        if (recentOtp.length == 0) {
            return res.status(403).json({
                success: false,
                message: "OTP not Found "
            })
        } else if (otp !== recentOtp) {
            return res.status(403).json({
                success: false,
                message: "Incorrect OTP"
            })
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10)


        //entry ceate in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            accountType,
            phoneNumber,
            additionalDetail: profileDetails._id,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstname} ${lastname}`,
        })

        //return response

        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            data: user
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Login
exports.Login = async (req, res) => {
    try {

        //get data from req body
        const { email, password } = req.body;

        //validate data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //user check exist or not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        //check password match or not
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            user.token = token;
            user.password = undefined;


            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,

            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User is logged in successfully",
                data: user
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//changePassword

exports.changePassword = async (req, res) => {
    try {
        // Get data from req body
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are mandatory"
            });
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        // Fetch the user from the database
        const user = await User.findById(req.user.id); // Assuming user ID is stored in req.user.id after authentication

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        // Optionally, send a confirmation email about the password change here

        // Return response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Error in changePassword: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};