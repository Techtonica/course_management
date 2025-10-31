const express = require("express")
const router = express.Router()
const surveyController = require("../controllers/surveyController")
const { authenticateToken } = require("../middleware/auth")
const { requireAdmin } = require("../middleware/permissions")

// Get survey template for an assignment
router.get("/template/assignment/:assignmentId", authenticateToken, surveyController.getSurveyTemplate)

// Get user's survey response
router.get("/response/:surveyTemplateId", authenticateToken, surveyController.getUserSurveyResponse)

// Submit survey response
router.post("/response", authenticateToken, surveyController.submitSurveyResponse)

// Admin only routes
router.post("/template", authenticateToken, requireAdmin, surveyController.createSurveyTemplate)
router.put("/template/:id", authenticateToken, requireAdmin, surveyController.updateSurveyTemplate)
router.get("/responses/assignment/:assignmentId", authenticateToken, requireAdmin, surveyController.getSurveyResponses)

module.exports = router
