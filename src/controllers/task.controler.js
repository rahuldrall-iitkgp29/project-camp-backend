import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiRespones } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { Types } from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async(req,res)=>{
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "project not found");
    }

    const tasks = await Task.find({
        project : new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo" , "avatar username fullName") //what we want from this

     return res
       .status(201)
       .json(new ApiRespones(201, tasks, "task fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
    const {title , description , assignedTo ,status} = req.body
    const {projectId} = req.params;
    const project = await Project.findById(projectId);

    if(!project){
        throw new ApiError(404,"project not found")
    }

    const files = req.files || []

    const attachements = files.map((file) => {
        return{
            url : `${process.env.SERVER_URL}/images/${file.originalname}`, //to get actuall url of our seveer where images saves
            mimetype : file.mimetype,
            size: file.size
        }
    })

    const task = await Task.create({
      title,
      description,
      project: new mongoose.Types.ObjectId(projectId),
      assignedTo: assignedTo
        ? new mongoose.Types.ObjectId(assignedTo)
        : undefined,
      status,
      assignedBy: new mongoose.Types.ObjectId(req.user._id),
      attachements,
    });

    return res.status(201).json(
        new ApiRespones(201,task,"task created successfully")
    )
});

const getTaskById = asyncHandler(async (req, res) => {
    const {taskId} = req.params
    const task = await Task.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(taskId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1,
              }
            },
          ],
        },
      },
      {
        $lookup: {
          from: "subtasks",
          localField: "_id",
          foreignField: "task",
          as: "subtasks",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project : {
                            _id : 1,
                            username : 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
              },
            },
            {
                $addFields : {
                    createdBy:{
                        $arrayElemAt : ["$createdBy" , 0]
                    }
                }
            }
          ],
        },
      },
      {
        $addFields : {
            assignedTo:{
                $arrayElemAt : ["$assignedTo",0]
            }
        }
      }
    ]);

    if(!task || task.length == 0){
        throw new ApiError(404 , "task not found")
    }

    return res.status(200).json(new ApiRespones(200 , task[0],"task fetched successfully"))
});

const updateTask = asyncHandler(async (req, res) => {});

const deleteTask = asyncHandler(async (req, res) => {});

const createSubTask = asyncHandler(async (req, res) => {});

const UpdateSubTask = asyncHandler(async (req, res) => {});

const deleteSubTask = asyncHandler(async (req, res) => {});


export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    UpdateSubTask,
    deleteSubTask
}