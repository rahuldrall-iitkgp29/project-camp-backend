import { User }  from "../models/user.models.js";
import { Project }  from "../models/user.models.js";
import { ProjectMember }  from "../models/user.models.js";
import { ApiRespones} from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"



const getProjects = asyncHandler(async(req,res) => {
    
})

const getProjectById = asyncHandler(async(req,res) => {

})

const createProject = asyncHandler(async(req,res) => {

})

const updateProject = asyncHandler(async(req,res) => {

})

const deleteProject = asyncHandler(async(req,res) => {

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