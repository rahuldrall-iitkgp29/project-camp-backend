import {ApiRespones} from "../utils/apiResponse.js" // ../ one directory back 


const healthCheck = (req,res) => {
    try {
        res.status(200).json(
            new ApiRespones(200 , {meassage : "server is runing"})
        )
    } catch (error) {
        
    }
}

export {healthCheck}