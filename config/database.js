const mongoose = require("mongoose")
require("dotenv").config()

exports.connect = () =>{
   mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   })
   .then(() => {
    console.log("DB Connected Sucessfully")

   })
   .catch((error) =>{
    console.error("DB Connection Failed", error)
    process.exit(1);
   })
}