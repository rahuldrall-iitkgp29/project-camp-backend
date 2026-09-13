// to handle file / image uploading

import multer from "multer";
const storage = multer.diskStorage({ //where we want to store them
    destination : function(req , file , cb){
        cb(null , `./public/images`) //cb-> call back fn , lcoation to store
    },
    filename : function(req,file,cb){
        cb(null , `${Date.now()}-${file.originalname}`) //date-filename => template of our store file
    },
})

export const upload = multer({
    storage,
    limits:{
        fileSize: 1*1000*1000,
    },
});