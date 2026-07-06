import { Router } from "express";
import registerUser from "../controllers/auth.controler.js"

const router = Router();

router.route("/").post(registerUser);
// we transfer our logic of auth through genral route "/" , rest route we add in app.js

export default router;
