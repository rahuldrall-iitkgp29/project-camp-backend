import { Router } from "express";
import {healthCheck} from "../controllers/healthCheck.js"

const router = Router()

router.route("/").get(healthCheck) 
// we transfer our logic of health check through genral route "/"

export default router;