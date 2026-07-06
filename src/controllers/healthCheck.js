import { ApiRespones } from "../utils/apiResponse.js"; // ../ one directory back
import { asyncHandler } from "../utils/asyncHandler.js";

/* method 1
const healthCheck = async (req,res,next) => {
    try {
        // some code to check health

        const user =  await getUserFromDB() // fetching data from db- can give error

        // if no error in code then this is the reponse
        res.status(200).json(
            new ApiRespones(200 , {meassage : "server is runing"})
        )
    } catch (error) {
        // this is the response while error in healthcheck code
        next(error)
    }
}
*/

//method 2
const healthCheck = asyncHandler(async (req, res) => {
  //health check code

  // response on success as json format
  res.status(200).json(new ApiRespones(200, { message: "server is runing" }));
});

export { healthCheck };

/*
the flow is:

Express calls your healthCheck function.
Code inside try starts executing.
If no error occurs, it reaches:
res.status(200).json(...);

and sends an HTTP 200 OK response to the client.

If an error occurs before or while creating the response, execution immediately jumps to the catch block, and the 200 response is not sent.
*/

/*
and try response is in json format like
{
  "statusCode": 200,
  "data": {
    "message": "server is running"
  },
  "message": "Success"
}
*/

/*
check we are performing
1. express is runing -> if our route perfoms well and res is sending its means server(express) is runing
*/
