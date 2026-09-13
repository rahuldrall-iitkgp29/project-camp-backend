import { Router } from "express";
import {
  addMemberToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getsProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controlers.js";

import { validate } from "../middlewares/validtor.middleware.js";

import {
  createProjectValidator,
  addMemberToProjectValidator,
} from "../validators/index.validatorts.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT) //means whatever i write after this line has verifyJWT validator by default -> who verify that is authentication done or not

router //to create project
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(),validate,createProject)

router // to upadate and delete project
  .route("/:projectId") //for params -> we fetch this everywhere in req.params
  .get(validateProjectPermission(AvailableUserRole),getProjectById) //availableuserRole -> is the array which contain all the roles => passing this means evryone allow to access getPeojectId contoroller
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]), //similar to ["ADMIN"]
    createProjectValidator(),
    validate,
    updateProject
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteProject
  )

router //to add member
    .route("/:projectId/member") //whatever right in : take in params(order not matter)
    .get(getsProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMemberToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateMemberRole
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteMember
    )

export default router;