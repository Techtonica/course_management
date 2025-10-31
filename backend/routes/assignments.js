const express = require("express")
const router = express.Router()
const assignmentController = require("../controllers/assignmentController")
const { authenticateToken } = require("../middleware/auth")
const { requireAdmin } = require("../middleware/permissions")

// All authenticated users can view assignments
router.get("/", authenticateToken, assignmentController.getAllAssignments)
router.get("/:id", authenticateToken, assignmentController.getAssignmentById)

// Admin only routes
router.post("/", authenticateToken, requireAdmin, assignmentController.createAssignment)
router.put("/:id", authenticateToken, requireAdmin, assignmentController.updateAssignment)
router.delete("/:id", authenticateToken, requireAdmin, assignmentController.deleteAssignment)
router.post("/bulk-assign", authenticateToken, requireAdmin, assignmentController.bulkAssign)

module.exports = router
