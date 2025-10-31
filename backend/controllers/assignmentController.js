const Assignment = require("../models/Assignment")
const emailService = require("../utils/emailService")
const Notification = require("../models/Notification")
const User = require("../models/User")

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const { courseId } = req.query
    let assignments

    if (courseId) {
      assignments = await Assignment.getByCourseId(courseId)
    } else {
      assignments = await Assignment.getAll()
    }

    res.json(assignments)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    res.status(500).json({ error: "Failed to fetch assignments" })
  }
}

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.getById(req.params.id)
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" })
    }
    res.json(assignment)
  } catch (error) {
    console.error("Error fetching assignment:", error)
    res.status(500).json({ error: "Failed to fetch assignment" })
  }
}

// Create assignment (admin only)
exports.createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body)
    console.log("Assignment created:", assignment.id)

    try {
      const participants = await User.getByRole("participant")
      for (const participant of participants) {
        await emailService.sendNewAssignmentNotification(participant, assignment)
        await Notification.create(participant.id, "new_assignment", `New assignment available: ${assignment.title}`)
      }
      console.log("Email notifications sent for new assignment")
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError)
      // Don't fail the request if email fails
    }

    res.status(201).json(assignment)
  } catch (error) {
    console.error("Error creating assignment:", error)
    res.status(500).json({ error: "Failed to create assignment" })
  }
}

// Update assignment (admin only)
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.update(req.params.id, req.body)
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" })
    }
    console.log("Assignment updated:", assignment.id)
    res.json(assignment)
  } catch (error) {
    console.error("Error updating assignment:", error)
    res.status(500).json({ error: "Failed to update assignment" })
  }
}

// Delete assignment (admin only)
exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.delete(req.params.id)
    console.log("Assignment deleted:", req.params.id)
    res.json({ message: "Assignment deleted successfully" })
  } catch (error) {
    console.error("Error deleting assignment:", error)
    res.status(500).json({ error: "Failed to delete assignment" })
  }
}

// Bulk assign to all participants (admin only)
exports.bulkAssign = async (req, res) => {
  try {
    const { assignmentId } = req.body
    const progressEntries = await Assignment.bulkAssignToParticipants(assignmentId)
    console.log("Bulk assigned to", progressEntries.length, "participants")

    try {
      const assignment = await Assignment.getById(assignmentId)
      const participants = await User.getByRole("participant")
      for (const participant of participants) {
        await emailService.sendNewAssignmentNotification(participant, assignment)
        await Notification.create(participant.id, "new_assignment", `New assignment assigned: ${assignment.title}`)
      }
      console.log("Email notifications sent for bulk assignment")
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError)
    }

    res.json({
      message: `Assignment assigned to ${progressEntries.length} participants`,
      count: progressEntries.length,
    })
  } catch (error) {
    console.error("Error bulk assigning:", error)
    res.status(500).json({ error: "Failed to bulk assign" })
  }
}
