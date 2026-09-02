import { User }  from "../models/user.models.js";
import { Project }  from "../models/user.models.js";
import { ProjectMember }  from "../models/user.models.js";
import { ApiRespones} from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";

// so now our auth work is done , means our user is already logged in 
// means we can fetch any req data from req.user , whenever we want

const getProjects = asyncHandler(async(req,res) => {
    const project = await ProjectMember.aggregate([ // aggregation pipeline
        {
            $match : {
                user : new mongoose.Types.ObjectId(req.user._id), //to find all the user with that id(getting all the project)
            },
        },
        {
            $lookup : {
                from : "projects",
                localField : "projects",
                foreignField : "_id",
                as : "projects",
                pipeline : [ //we are adding further pipeline in those selected document only
                    {
                        $lookup : {
                            from : "projectmembers",
                            localField : "_id",
                            foreignField : "projects",
                            as : "projectmembers"
                        }
                    },
                    {
                        $addFields : {
                            members : {
                                $size : "$projectmembers"
                            }
                        }
                    }
                ]
            },
        },
        {
            $unwind : "$project"
        },
        {
            $project : {
                project : {
                    _id : 1,
                    name : 1,
                    description : 1,
                    members : 1,
                    createdAt : 1,
                    createdBy : 1
                },
                role : 1,
                _id : 0
            }
        }
    ]);

    return res.status(200).json(new ApiRespones(200 , projects , "project fetch successfully"))
})

const getProjectById = asyncHandler(async(req,res) => {

})

const createProject = asyncHandler(async(req,res) => {
    const {name , description} = req.body ; // we fetch name and desc of project from frontend
    const project =  await Project.create({
        name,
        description,
        createdBy : new mongoose.Types.ObjectId(req.user._id) // to make sure our id is an mongo db id
    });
    await ProjectMember.create(
        {
            user : new mongoose.Types.ObjectId(req.user._id),
            project : new mongoose.Types.ObjectId(project._id),
            role : UserRolesEnum.ADMIN //give her admin role
        }
    )

    return res 
            .status(201)
            .json(
                new ApiRespones(
                    201,
                    project,
                    "Project Created Successfully"
                )
            )
})

const updateProject = asyncHandler(async(req,res) => {
    const {name , description} = req.body
    const {projectId} = req.params 

    await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description,
        },
        {new : true}
    )

    if(!project){
        throw new ApiError(404 , "project not found")
    }
    return res 
            .status(200)
            .json(
                new ApiRespones(
                    200,
                    project,
                    "project updated successfully"
                )
            )
})

const deleteProject = asyncHandler(async(req,res) => {
    const {projectId} = req.params

    const project = await Project.findByIdAndDelete(projectId)
    if(!project){
        throw new ApiError(404 , "project not found")
    }
    return res 
            .status(200)
            .json(
                new ApiRespones(
                    200,
                    project,
                    "project deleted successfully"
                )
            )
})

const addMemberToProject = asyncHandler(async(req,res) => {

})

const getsProjectMembers = asyncHandler(async(req,res) => {

})

const updateMemberRole = asyncHandler(async(req,res) => {

})

const deleteMember = asyncHandler(async(req,res) => {

})


export {
    addMemberToProject,
    createProject,
    deleteMember,
    getProjects,
    getProjectById,
    getsProjectMembers,
    updateProject,
    deleteProject,
    updateMemberRole,
}