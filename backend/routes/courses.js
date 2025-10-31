const express = require("express")
const router = express.Router()
const courseController = require("../controllers/courseController")
const { authenticateToken } = require("../middleware/auth")
const { requireAdmin } = require("../middleware/permissions")

// Public routes
router.get("/", courseController.getAllCourses)
router.get("/:id", courseController.getCourseById)

// Admin only routes
router.post("/", authenticateToken, requireAdmin, courseController.createCourse)
router.put("/:id", authenticateToken, requireAdmin, courseController.updateCourse)
router.delete("/:id", authenticateToken, requireAdmin, courseController.deleteCourse)

module.exports = router
