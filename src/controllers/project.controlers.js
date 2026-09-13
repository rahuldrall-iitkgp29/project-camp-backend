import User from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiRespones} from "../utils/apiResponse.js"
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ProjectNote } from "../models/note.models.js";
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";
import {AvailableUserRole , UserRolesEnum} from "../utils/constants.js";
import { pipeline } from "nodemailer/lib/xoauth2/index.js";

// so now our auth work is done , means our user is already logged in 
// means we can fetch any req data from req.user , whenever we want

const getProjects = asyncHandler(async(req,res) => {
    const projects = await ProjectMember.aggregate([ // aggregation pipeline
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
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404 , "project not found");
    }

    return res
        .status(200)
        .json(new ApiRespones(200 , project , "project fetched successfully"));
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

    const project = await Project.findByIdAndUpdate(
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

    const tasks = await Task.find({ project: projectId });
    const taskIds = tasks.map(t => t._id);
    await Subtask.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ project: projectId });
    await ProjectNote.deleteMany({ project: projectId });
    await ProjectMember.deleteMany({ project: projectId });

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
    const {email , role} = req.body
    const {projectId} = req.params
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404,"user not exist")
    }

    await ProjectMember.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId),
      },
      {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId),
        role : role,
      },
      {
        new : true,
        upsert : true
      }
    );

    return res.status(201).json(new ApiRespones(201,{},"project member added"));
})

const getsProjectMembers = asyncHandler(async(req,res) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404,"project not found")
    }

    const projectmembers = await ProjectMember.aggregate([
        {
            $match : {
                project : new mongoose.Types.ObjectId(projectId),
            },
        },
        {
            $lookup : {
                from : "users",
                localField : "user",
                foreignField : "_id",
                as : "user",
                pipeline: [
                    {
                        $project : {
                            _id : 1,
                            username : 1,
                            fullName : 1,
                            avatar : 1
                        },
                    },
                ],
            },
        },
        {
            $addFields : {
                user : {
                    $arrayElemAt : ["$user" , 0]
                }
            }
        },
        {
            $project : {
                project : 1,
                user : 1,
                role : 1,
                createdAt : 1,
                updatedAt : 1,
                _id : 0
            }
        }
    ])

    return res.status(200).json(new ApiRespones(200,projectmembers,"project members fetched"))
})

const updateMemberRole = asyncHandler(async(req,res) => {
    const {projectId , userId} = req.params
    const {newRole} = req.body

    if(!AvailableUserRole.includes(newRole)){
        throw new ApiError(400 ,"role not found/invalid role")
    }

    let projectMember = await ProjectMember.findOne({
        project : new mongoose.Types.ObjectId(projectId),
        user : new mongoose.Types.ObjectId(userId)
    })

    if (!projectMember) {
      throw new ApiError(400, "project member not found");
    }

    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role : newRole
        },
        {
            new : true
        }
    )

    if (!projectMember) {
      throw new ApiError(400, "project member not found");
    }

    return res.status(200).json(new ApiRespones(200,projectMember,"project member role updated"));
})

const deleteMember = asyncHandler(async(req,res) => {
    const { projectId, userId } = req.params;

    let projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!projectMember) {
      throw new ApiError(400, "project member not found");
    }

    projectMember = await ProjectMember.findByIdAndDelete(
      projectMember._id,
    );

    if (!projectMember) {
      throw new ApiError(400, "project member not found");
    }

    return res
      .status(200)
      .json(new ApiRespones(200, projectMember, "project member deleted successfully"));
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