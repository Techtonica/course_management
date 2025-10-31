const express = require("express")
const router = express.Router()
const Submission = require("../models/Submission")
const Progress = require("../models/Progress")
const Survey = require("../models/Survey")
const { exportSubmissionsToCSV, exportProgressToCSV, exportSurveyResponsesToCSV } = require("../utils/csvExport")
const { authenticateToken } = require("../middleware/auth")
const { requireAdmin } = require("../middleware/permissions")

// Export submissions to CSV
router.get("/submissions", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      assignmentId: req.query.assignmentId,
      status: req.query.status,
    }

    const submissions = await Submission.getAll(filters)
    const csv = exportSubmissionsToCSV(submissions)

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=submissions.csv")
    res.send(csv)

    console.log("Exported", submissions.length, "submissions to CSV")
  } catch (error) {
    console.error("Error exporting submissions:", error)
    res.status(500).json({ error: "Failed to export submissions" })
  }
})

// Export progress to CSV
router.get("/progress", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, assignmentId } = req.query
    let progressData

    if (userId) {
      progressData = await Progress.getByUserId(userId)
    } else if (assignmentId) {
      progressData = await Progress.getByAssignmentId(assignmentId)
    } else {
      return res.status(400).json({ error: "userId or assignmentId required" })
    }

    const csv = exportProgressToCSV(progressData)

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=progress.csv")
    res.send(csv)

    console.log("Exported", progressData.length, "progress entries to CSV")
  } catch (error) {
    console.error("Error exporting progress:", error)
    res.status(500).json({ error: "Failed to export progress" })
  }
})

// Export survey responses to CSV
router.get("/surveys/:assignmentId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const responses = await Survey.getResponsesByAssignmentId(req.params.assignmentId)
    const csv = exportSurveyResponsesToCSV(responses)

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=survey_responses.csv")
    res.send(csv)

    console.log("Exported", responses.length, "survey responses to CSV")
  } catch (error) {
    console.error("Error exporting survey responses:", error)
    res.status(500).json({ error: "Failed to export survey responses" })
  }
})

module.exports = router
