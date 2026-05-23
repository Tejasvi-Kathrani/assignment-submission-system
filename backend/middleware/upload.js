const multer = require("multer")

const storage = multer.diskStorage({
 destination: (req,file,cb)=>{
  cb(null,"uploads/")
 },
 filename: (req,file,cb)=>{
  const unique = Date.now() + "-" + file.originalname
  cb(null, unique)
 }
})

const upload = multer({
 storage,
 fileFilter: (req,file,cb)=>{
  if(file.mimetype === "application/pdf"){
   cb(null,true)
  }else{
   cb(new Error("Only PDF allowed"), false)
  }
 }
})

module.exports = upload