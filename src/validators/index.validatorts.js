import { body } from "express-validator";
// as of now our most of data is come from body itself

const userRegistrationValidator = () => {//user registratioin validator
    return [
        body("email") //inbuild fn express-validators
            .trim()
            .notEmpty()
            .withMessage("Email is required")//if submitted empty then this messaage go with an error
            .isEmail()//there was a format of email , if that not followed then below message go with an error 
            .withMessage("Email is invalid"),
        body("username") //now validators for username
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be between 3 and 20 characters"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters")
    ]
}

const userLoginValidator = ()=>{
    return [
        body("email")
            .isEmail()
            .withMessage("email not valide"),
        body("password")
            .notEmpty()
            .withMessage("pass is required")
    ]
}

const userChanggedCurrentPasswordValidator = () => {
    return[
        body("oldPassword")
            .notEmpty()
            .withMessage("old password is required"),

        body("newPassword")
            .notEmpty()
            .withMessage("old password is required"),

    ]
};

const userForgotPasswordValidtor = () => {
    return[
        body("email")
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("invalid email")
    ]
};


const userRestForgotPasswordValidator = () => {
    return[
        body("newPassword")
            .notEmpty().withMessage("password is required")
    ]
}

export{
    userRegistrationValidator,
    userLoginValidator,
    userChanggedCurrentPasswordValidator,
    userForgotPasswordValidtor,
    userRestForgotPasswordValidator
}