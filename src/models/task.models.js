import mongoose, { Schema } from "mongoose"; 

import {AvailableTaskStatus , TaskStatusEnum} from "../utils/constants.js";
import mimeTypes from "nodemailer/lib/mime-funcs/mime-types.js";

const taskSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : String , // shortcut
    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true,
    },
    assignedTo : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    assignedBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    status : {
        type : String,
        enum : AvailableTaskStatus,
        default : TaskStatusEnum.TODO
    },
    attachements : {
        type : [{
            url:String,
            mimeTypes : String,
            size : Number 
        }],
        default : []
    }
},
    {timestamps : true},
)

export const Taks = moongoose.model("Task",taskSchema);