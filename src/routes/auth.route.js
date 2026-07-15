import { Router } from "express";
import registerUser from "../controllers/auth.controler.js"

import { validate } from "../middlewares/validtor.middleware.js";
import { userRegistrationValidator } from "../validators/index.validatorts.js";

const router = Router();

router.route("/register").post( userRegistrationValidator(), validate, registerUser);
// we use post method because we are sending data to server and we want to create a new user in our database
// we use userRegistrationValidator() to validate our data and validate to check if there is any error in our data and if there is any error then it will throw an error and if there is no error then it will go to registerUser controller
// we transfer our logic of auth through route "/register" , rest route we add in app.js

export default router;
