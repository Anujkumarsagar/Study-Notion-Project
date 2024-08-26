// enter email -> mail paer link bhejenge frontend ka -> click kiya reset password frontend pei direct kiya -> new Password dala -> submit
const { response } = require("express")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("'bcrypt")
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req body
        const email = req.body.email
        //check user for this email , email validation
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        //generate token
        const token = crypto.randomUUID()
        // update user by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate({
            email: email
        },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000 //  hour
            }, { new: true })
        // create url
        const resetUrl = `http://localhost:3000/update-password/${token}`
        // send email
        await mailSender(email, "Password reset Link", `Password Reset Link: ${resetUrl}`)
        // send mail to containing the url
        // return response 
        res.status(200).json(
            { success: true, message: "Reset password link sent to your email" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to send reset password link"
        })
    }
}

//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        //data fetch 
        const { password, confirmPassword, token } = req.body
        //validation 
        if (password !== confirmPassword) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Passwords do not match"
                }
            )
        }

        // get userDetails from db using token
        const userDetails = await User.findOne({ token: token });
        // if no entry - invalid token 
        if (!userDetails) {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
        // token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                status: false,
                message: "Token expired"
            })
        }
        // hash pwd
        const hashPassword = await bcrypt.hash(password, 10)

        //password update,
        await User.findOneAndUpdate(
            { token: token },
            { password: hashPassword },
            { new: true }
        )
        // return response
        res.status(200).json({
            status: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to send reset password link"
        })
    }
}