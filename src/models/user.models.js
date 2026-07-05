import mongoose , { Schema } from "mongoose"; // we import mongoose and schema
import bcrypt from {bcrypt}

const userSchema = new Schema(
    { //we give object as schema
        avatar : { //image
            type : {
                url : String,
                localPath : String,
            },
            default : { // if user not give an avatar
                url : `https://placehold.co/200x200`,
                localPath : ""
            }
        },
        username : {
            type: String , //username is of type
            required : true, // mongodb do this , means this thing is required to move further
            unique : true , // mdb search in our database for uniqueness of this thing
            lowercase : true, //this save in lower case
            trim : true, // remove extra spaces
            index : true, //we give index to username to make easy in searching
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
        },
        fullName:{
            type : String,
            trim : true,
            lowercase : true
        },
        password : {
            type : String,
            required : [true , "password is required"] , // we pass custom error if someone not enter poassword
        },
        isEmailVerified : {
            type : Boolean,
            default : false 
        },
        refreshToken : {
            type : String 
        },
        forgotPasswordToken : {
            type : String
        },
        forgotPasswordTokenExpiry : { 
        // we dont want to store reset pass token for all time in our db , they are custom generated each time
            type : Date
        },
        emailVerficationToken : {
            type : String
        },
        emailVerficationTokenExpiry : {
            type : Date
        }
    },//first object is all the fields
    {
        timestamps : true,
    }
);

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next() //if smt else then pass is change so dont hash our pass again and again , just on click save
    this.password = await bcrypt.hash(this.password , 10) 
    next()//go to next operation
})


userSchema.methods.isPasswordCorrect = async function (password) { 
    //we just add an method isPasswordCorrect to userSchema
    return await bcrypt.compare(password , this.password)
    //now this hash inpuit pass same no of time and compare the hash from db and input , then return boolean to us [its take some time to done so await]
}

export const user =  mongoose.model("user" , userSchema)
//store user in userSchema form in mongodb and then export it as object:user to use 


//schema -> structure
//we use placehold -> for default avatar

/*
pass hashing
we hash our password into an hashed manner (its a very long string) which cant easily be reversed 
this save our users password
we use [bcrypt] for this from npm packages
we can encrypt any thing using this
*/

// data --> pre(things before save) --> SAVE --> post(things after)

/*
userSchema.pre("save" , async function (next) {
    this.password = await bcrypt.hash(this.password , 10) //(data, no of rounds of hash) and we over  write our current pass with this hash one
}) 
//things done before saving data[.pre(action happening , fn to perform)]
// pass next -> my work is done now you go to another hook or save it
*/