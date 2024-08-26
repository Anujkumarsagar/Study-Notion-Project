//auth
exports.Auth = async(req, res, next) =>{
    try {
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "")

        // if token missing then return response  
        if (!token){
            return res.status(401).json({
                message: "Token is missing"
            })
        }

        // 
        // verify the token
        try {
            const decode = await jwt.verify (token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode;

            
        } catch (error) {
            // verficaction - issue

            return res.status(401).json({
                success: false,
                message: "Token is not valid"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Failed to authenticate user"
        })
    }
}

//isStudent
exports.isStudent = async (req, res, next) =>{
    // try {
    //     if (req.user.role === "Student"){
    //         next();
    //     }else{
    //         return res.status(403).json({
    //             message: "You are not authorized to access this resource"
    //         })
    //     }
    // } catch (error) {
        
    // }


    try {
        // database se fetch karo
        const accountType = req.user.role;
        if (accountType !== "Student"){
            return res.json({
                success: false,
                message: "You are not authorized to access this Student resources"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Failed to authenticate Student"
        })
    }
}
//isInstructor

exports.isInstructor = async (req, res, next) =>{


    try {
        // database se fetch karo
        const accountType = req.user.role;
        if (accountType !== "Instructor"){
            return res.json({
                success: false,
                message: "You are not authorized to access this Instructor resources "
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Failed to authenticate Instructor"
        })
    }
}

//isAdmin