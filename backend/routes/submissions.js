const express = require("express")
const router = express.Router()
const submissionController = require("../controllers/submissionController")
const { authenticateToken } = require("../middleware/auth")
const { requireAdminOrVolunteer } = require("../middleware/permissions")

// All authenticated users can view submissions (filtered by permissions in controller)
router.get("/", authenticateToken, submissionController.getAllSubmissions)
router.get("/:id", authenticateToken, submissionController.getSubmissionById)

// Participants can create/update their own submissions
router.post("/", authenticateToken, submissionController.createOrUpdateSubmission)

// Admin/volunteer can update submission status
router.patch("/:id/status", authenticateToken, requireAdminOrVolunteer, submissionController.updateSubmissionStatus)

module.exports = router
