const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const mailSender = require("../utils/mailSender");
const OtpSchema = mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true
   },
   otp: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now(),
      expires: 5 * 60
   }
});

//a function -> to send emails

async function sendVerficationEmail(email, otp) {
   try {

      const mailResponse = await mailSender(email, "Verfication Email from StudyNotion", otp)
      console.log("mailSender", mailResponse)
   } catch (error) {
      console.log("Error in SendVerficationEmail ", error.message)
      throw new Error("Failed to send verification email")
   }
}
OtpSchema.pre("save", async function (next) {

   await sendVerficationEmail(this.email, otp)
   next()

})

module.exports = mongoose.model("OTP", OtpSchema)