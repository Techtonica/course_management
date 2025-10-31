const Feedback = require("../models/Feedback")
const emailService = require("../utils/emailService")
const Notification = require("../models/Notification")
const Submission = require("../models/Submission")
const User = require("../models/User")

// Get feedback for a submission
exports.getFeedbackBySubmissionId = async (req, res) => {
  try {
    const feedback = await Feedback.getBySubmissionId(req.params.submissionId)
    res.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    res.status(500).json({ error: "Failed to fetch feedback" })
  }
}

// Create feedback (admin/volunteer only)
exports.createFeedback = async (req, res) => {
  try {
    const feedbackData = {
      ...req.body,
      reviewer_id: req.user.id, // Use authenticated user as reviewer
    }

    const feedback = await Feedback.create(feedbackData)
    console.log("Feedback created:", feedback.id)

    try {
      const submission = await Submission.getById(req.body.submission_id)
      const participant = await User.getById(submission.user_id)
      const feedbackWithReviewer = {
        ...feedback,
        reviewer_name: req.user.name,
      }

      await emailService.sendFeedbackNotification(participant, submission, feedbackWithReviewer)
      await Notification.create(
        participant.id,
        "feedback_received",
        `New feedback received on: ${submission.assignment_title}`,
      )
      console.log("Feedback email notification sent")
    } catch (emailError) {
      console.error("Error sending feedback email:", emailError)
      // Don't fail the request if email fails
    }

    res.status(201).json(feedback)
  } catch (error) {
    console.error("Error creating feedback:", error)
    res.status(500).json({ error: "Failed to create feedback" })
  }
}

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.update(req.params.id, req.body)
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" })
    }
    console.log("Feedback updated:", feedback.id)
    res.json(feedback)
  } catch (error) {
    console.error("Error updating feedback:", error)
    res.status(500).json({ error: "Failed to update feedback" })
  }
}

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.delete(req.params.id)
    console.log("Feedback deleted:", req.params.id)
    res.json({ message: "Feedback deleted successfully" })
  } catch (error) {
    console.error("Error deleting feedback:", error)
    res.status(500).json({ error: "Failed to delete feedback" })
  }
}
