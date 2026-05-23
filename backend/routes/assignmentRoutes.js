const router = require("express").Router()
const assignmentController = require("../controllers/assignmentController")
const auth = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")

router.post("/", auth, upload.single("file"), assignmentController.createAssignment)

router.get("/", auth, assignmentController.getAssignments)

router.get("/:id", auth, assignmentController.getAssignmentById)

router.delete("/:id", auth, assignmentController.deleteAssignment)
module.exports = router

