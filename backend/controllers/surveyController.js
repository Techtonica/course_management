const Survey = require("../models/Survey")

// Get survey template for an assignment
exports.getSurveyTemplate = async (req, res) => {
  try {
    const template = await Survey.getTemplateByAssignmentId(req.params.assignmentId)
    if (!template) {
      return res.status(404).json({ error: "Survey template not found" })
    }
    res.json(template)
  } catch (error) {
    console.error("Error fetching survey template:", error)
    res.status(500).json({ error: "Failed to fetch survey template" })
  }
}

// Create survey template (admin only)
exports.createSurveyTemplate = async (req, res) => {
  try {
    const template = await Survey.createTemplate(req.body)
    console.log("Survey template created:", template.id)
    res.status(201).json(template)
  } catch (error) {
    console.error("Error creating survey template:", error)
    res.status(500).json({ error: "Failed to create survey template" })
  }
}

// Update survey template (admin only)
exports.updateSurveyTemplate = async (req, res) => {
  try {
    const { questions } = req.body
    const template = await Survey.updateTemplate(req.params.id, questions)
    if (!template) {
      return res.status(404).json({ error: "Survey template not found" })
    }
    console.log("Survey template updated:", template.id)
    res.json(template)
  } catch (error) {
    console.error("Error updating survey template:", error)
    res.status(500).json({ error: "Failed to update survey template" })
  }
}

// Submit survey response
exports.submitSurveyResponse = async (req, res) => {
  try {
    const responseData = {
      ...req.body,
      user_id: req.user.id, // Use authenticated user
    }

    const response = await Survey.submitResponse(responseData)
    console.log("Survey response submitted:", response.id)
    res.status(201).json(response)
  } catch (error) {
    console.error("Error submitting survey response:", error)
    res.status(500).json({ error: "Failed to submit survey response" })
  }
}

// Get survey responses for an assignment (admin only)
exports.getSurveyResponses = async (req, res) => {
  try {
    const responses = await Survey.getResponsesByAssignmentId(req.params.assignmentId)
    res.json(responses)
  } catch (error) {
    console.error("Error fetching survey responses:", error)
    res.status(500).json({ error: "Failed to fetch survey responses" })
  }
}

// Get user's survey response
exports.getUserSurveyResponse = async (req, res) => {
  try {
    const { surveyTemplateId } = req.params
    const response = await Survey.getUserResponse(surveyTemplateId, req.user.id)
    if (!response) {
      return res.status(404).json({ error: "Survey response not found" })
    }
    res.json(response)
  } catch (error) {
    console.error("Error fetching user survey response:", error)
    res.status(500).json({ error: "Failed to fetch survey response" })
  }
}
