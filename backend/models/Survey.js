const { query } = require("../config/database")

class Survey {
  // Get survey template for an assignment
  static async getTemplateByAssignmentId(assignmentId) {
    const result = await query("SELECT * FROM survey_templates WHERE assignment_id = $1", [assignmentId])
    return result.rows[0]
  }

  // Create survey template
  static async createTemplate(templateData) {
    const { assignment_id, questions } = templateData
    const result = await query("INSERT INTO survey_templates (assignment_id, questions) VALUES ($1, $2) RETURNING *", [
      assignment_id,
      JSON.stringify(questions),
    ])
    return result.rows[0]
  }

  // Update survey template
  static async updateTemplate(id, questions) {
    const result = await query("UPDATE survey_templates SET questions = $1 WHERE id = $2 RETURNING *", [
      JSON.stringify(questions),
      id,
    ])
    return result.rows[0]
  }

  // Submit survey response
  static async submitResponse(responseData) {
    const { survey_template_id, user_id, responses } = responseData
    const result = await query(
      `INSERT INTO survey_responses (survey_template_id, user_id, responses) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (survey_template_id, user_id) 
       DO UPDATE SET responses = $3, created_at = CURRENT_TIMESTAMP 
       RETURNING *`,
      [survey_template_id, user_id, JSON.stringify(responses)],
    )
    return result.rows[0]
  }

  // Get survey responses for an assignment (aggregated)
  static async getResponsesByAssignmentId(assignmentId) {
    const result = await query(
      `
      SELECT sr.*, u.name as user_name, u.github_username
      FROM survey_responses sr
      JOIN survey_templates st ON sr.survey_template_id = st.id
      JOIN users u ON sr.user_id = u.id
      WHERE st.assignment_id = $1
      ORDER BY sr.created_at DESC
    `,
      [assignmentId],
    )
    return result.rows
  }

  // Get user's survey response
  static async getUserResponse(surveyTemplateId, userId) {
    const result = await query("SELECT * FROM survey_responses WHERE survey_template_id = $1 AND user_id = $2", [
      surveyTemplateId,
      userId,
    ])
    return result.rows[0]
  }
}

module.exports = Survey
