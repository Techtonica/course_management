const Progress = require("../models/Progress")

// Get progress for a user
exports.getProgressByUserId = async (req, res) => {
  try {
    const progress = await Progress.getByUserId(req.params.userId)
    res.json(progress)
  } catch (error) {
    console.error("Error fetching progress:", error)
    res.status(500).json({ error: "Failed to fetch progress" })
  }
}

// Get progress for an assignment
exports.getProgressByAssignmentId = async (req, res) => {
  try {
    const progress = await Progress.getByAssignmentId(req.params.assignmentId)
    res.json(progress)
  } catch (error) {
    console.error("Error fetching progress:", error)
    res.status(500).json({ error: "Failed to fetch progress" })
  }
}

// Update progress status
exports.updateProgress = async (req, res) => {
  try {
    const { userId, assignmentId, status } = req.body
    const progress = await Progress.updateStatus(userId, assignmentId, status)
    console.log("Progress updated for user", userId, "assignment", assignmentId)
    res.json(progress)
  } catch (error) {
    console.error("Error updating progress:", error)
    res.status(500).json({ error: "Failed to update progress" })
  }
}
