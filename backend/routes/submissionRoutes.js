const router = require("express").Router()
const submissionController = require("../controllers/submissionController")
const multer = require("multer")
const auth = require("../middleware/authMiddleware")

const storage = multer.diskStorage({
 destination:"uploads/",
 filename:(req,file,cb)=>{
  cb(null,Date.now()+"-"+file.originalname)
 }
})

const upload = multer({storage})

router.post(
 "/",
 auth,
 upload.single("file"),
 submissionController.submitAssignment
)

router.get(
 "/assignment/:id",
 auth,
 submissionController.getSubmissionsByAssignment
)

router.get(
 "/student/:id",
 submissionController.getSubmissionsByStudent
)

router.put(
 "/:id",
 submissionController.gradeSubmission
)

module.exports = router