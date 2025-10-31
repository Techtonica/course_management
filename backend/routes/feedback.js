const express = require("express")
const router = express.Router()
const feedbackController = require("../controllers/feedbackController")
const { authenticateToken } = require("../middleware/auth")
const { requireAdminOrVolunteer } = require("../middleware/permissions")

// All authenticated users can view feedback
router.get("/submission/:submissionId", authenticateToken, feedbackController.getFeedbackBySubmissionId)

// Admin/volunteer can create, update, delete feedback
router.post("/", authenticateToken, requireAdminOrVolunteer, feedbackController.createFeedback)
router.put("/:id", authenticateToken, requireAdminOrVolunteer, feedbackController.updateFeedback)
router.delete("/:id", authenticateToken, requireAdminOrVolunteer, feedbackController.deleteFeedback)

module.exports = router
