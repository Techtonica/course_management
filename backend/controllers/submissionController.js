const Submission = require("../models/Submission")

// Get all submissions (with filters)
exports.getAllSubmissions = async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      assignmentId: req.query.assignmentId,
      status: req.query.status,
    }

    const submissions = await Submission.getAll(filters)
    res.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ error: "Failed to fetch submissions" })
  }
}

// Get submission by ID
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.getById(req.params.id)
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" })
    }
    res.json(submission)
  } catch (error) {
    console.error("Error fetching submission:", error)
    res.status(500).json({ error: "Failed to fetch submission" })
  }
}

// Create or update submission
exports.createOrUpdateSubmission = async (req, res) => {
  try {
    const submissionData = {
      ...req.body,
      user_id: req.user.id, // Use authenticated user's ID
    }

    const submission = await Submission.createOrUpdate(submissionData)
    console.log("Submission created/updated:", submission.id)
    res.status(201).json(submission)
  } catch (error) {
    console.error("Error creating/updating submission:", error)
    res.status(500).json({ error: "Failed to create/update submission" })
  }
}

// Update submission status (admin/volunteer only)
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body
    const submission = await Submission.updateStatus(req.params.id, status)
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" })
    }
    console.log("Submission status updated:", submission.id, "to", status)
    res.json(submission)
  } catch (error) {
    console.error("Error updating submission status:", error)
    res.status(500).json({ error: "Failed to update submission status" })
  }
}
