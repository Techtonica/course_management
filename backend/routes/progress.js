const express = require("express")
const router = express.Router()
const progressController = require("../controllers/progressController")
const { authenticateToken } = require("../middleware/auth")
const { requireAdminOrVolunteer } = require("../middleware/permissions")

// Get progress by user ID
router.get("/user/:userId", authenticateToken, progressController.getProgressByUserId)

// Get progress by assignment ID (admin/volunteer only)
router.get(
  "/assignment/:assignmentId",
  authenticateToken,
  requireAdminOrVolunteer,
  progressController.getProgressByAssignmentId,
)

// Update progress (admin only for now)
router.put("/", authenticateToken, requireAdminOrVolunteer, progressController.updateProgress)

module.exports = router
