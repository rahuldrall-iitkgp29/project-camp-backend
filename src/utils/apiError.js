class ApiError extends Error{
    constructor(
        statusCode,
        meassage = "Something went wrong", // we are keep on changing it
        errors = [] , // we keep all our coming error into this array
        stack = ""
    ){
        super(meassage)
        this.statusCode = statusCode
        this.data = null
        this.success = false
        this.errors = errors
        this.message = meassage

        if(stack){
            this.stack = stack // if we have an stack trace thrown by our error then we use that
        }else{
            Error.captureStackTrace(this , this.constructor) //otherwise we automatically trace an default stack trace and create them in our constructor 
        }
    }
}

export {ApiError};