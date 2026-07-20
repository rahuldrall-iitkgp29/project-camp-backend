/*
every time user send access token and our server check it each
so rather every middleware verify our access token we write a middleware code who varify access token
*/
import User from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")  ;
    //if i got cokkie then access access token from it or from bearer tokens and replace it from bearer to nothing and then give it back


    if(!token){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) //just pass uncoded token and secret of decode , and jwt will decode it
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerficationToken -emailVerficationTokenExpiry")
        //find this user by id bcz we store id inside token then give only selected info to us
        if(!user){//means no user found with that id
            throw new ApiError(401,"Invalid access token")
        }
        req.user = user //we create new property inside req and store user inside it
        next()
    } catch (error) {
        throw new ApiError(401,"Invalid access token")
    }
})