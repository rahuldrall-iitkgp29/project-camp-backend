import mongoose, { Schema } from "mongoose"; 

const projectNotedSchema = new Schema({
    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    content : {
        type : String,
        required : ture
    }
} , {timestamps : true});

export const ProjectNote = mongoose.model("ProjectNote" , projectNotedSchema)