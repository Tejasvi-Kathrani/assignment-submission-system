const router = require("express").Router()
const adminController = require("../controllers/adminController")
const auth = require("../middleware/authMiddleware")

router.get("/users", auth, adminController.getUsers)

router.get("/users/inactive", auth, adminController.getInactiveUsers)

router.delete("/users/:id", auth, adminController.deleteUser)

router.put("/users/restore/:id", auth, adminController.restoreUser)

router.put("/users/:id", auth, adminController.updateUser)

router.get("/assignments", auth, adminController.getAssignments)

router.get("/submissions", auth, adminController.getSubmissions)

router.get("/report", auth, adminController.getReport)

module.exports = router