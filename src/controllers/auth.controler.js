import User  from "../models/user.models.js";
import { ApiRespones} from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {emailVerficationMailgenContent, sendingEmail} from "../utils/mail.utils.js"


const genAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        //now whichever user we want to access stores in [user]
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false }) // saving refreshToken
        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "Something went wrong wile generated access token")
    }
}


const registerUser = asyncHandler(async (req,res)=>{
    const {email , username , password , role } = req.body //data is come from body(we assume it from our frontend)

    const existedUser = await User.findOne({
        $or : [{username} , {email}] //if we find email or username in our db we don't register uer     
    })

    if(existedUser){
        throw new  ApiError(404,"username/email is already exist" , [])
    }


    //if we dont find an user
    const user = await User.create({ //also all functionallity we write in User is available in user also 
        email,
        password,
        username,
        isEmailVerified : false
    })

    const {unhashedToken, hashedToken, tokenExpiry} = user.genrateTemporaryToken()


    user.emailVerficationToken = hashedToken;
    user.emailVerficationTokenExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false});

    await sendingEmail(
        {//these our options
            email : user?.email,
            subject: "Please verify your email",
            mailgenContent : emailVerficationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}` //dynamic links/url
            ),
        }
    );

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerficationToken -emailVerficationTokenExpiry",
    )

    if(!createdUser){
        throw new ApiError(500 , "smt went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiRespones(
            200,
            {user : createdUser},
            "user registered successfully and verification email has been sent on your email",
        )
    )
});

export default registerUser;