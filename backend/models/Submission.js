const { query } = require("../config/database")

class Submission {
  // Get all submissions (with filters)
  static async getAll(filters = {}) {
    let sql = `
      SELECT s.*, 
             u.name as user_name, u.github_username, u.email,
             a.title as assignment_title, a.course_id,
             c.title as course_title
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (filters.userId) {
      sql += ` AND s.user_id = $${paramCount}`
      params.push(filters.userId)
      paramCount++
    }

    if (filters.assignmentId) {
      sql += ` AND s.assignment_id = $${paramCount}`
      params.push(filters.assignmentId)
      paramCount++
    }

    if (filters.status) {
      sql += ` AND s.status = $${paramCount}`
      params.push(filters.status)
      paramCount++
    }

    sql += " ORDER BY s.submitted_at DESC"

    const result = await query(sql, params)
    return result.rows
  }

  // Get submission by ID
  static async getById(id) {
    const result = await query(
      `
      SELECT s.*, 
             u.name as user_name, u.github_username, u.email, u.avatar_url,
             a.title as assignment_title, a.description as assignment_description,
             c.title as course_title
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      WHERE s.id = $1
    `,
      [id],
    )
    return result.rows[0]
  }

  // Create or update submission
  static async createOrUpdate(submissionData) {
    const { assignment_id, user_id, github_url } = submissionData

    // Check if submission already exists
    const existing = await query("SELECT id FROM submissions WHERE assignment_id = $1 AND user_id = $2", [
      assignment_id,
      user_id,
    ])

    if (existing.rows.length > 0) {
      // Update existing submission
      const result = await query(
        "UPDATE submissions SET github_url = $1, submitted_at = CURRENT_TIMESTAMP, status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE assignment_id = $2 AND user_id = $3 RETURNING *",
        [github_url, assignment_id, user_id],
      )

      // Update progress to in_progress
      await query("UPDATE progress SET status = 'in_progress' WHERE assignment_id = $1 AND user_id = $2", [
        assignment_id,
        user_id,
      ])

      return result.rows[0]
    } else {
      // Create new submission
      const result = await query(
        "INSERT INTO submissions (assignment_id, user_id, github_url, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
        [assignment_id, user_id, github_url],
      )

      // Create or update progress
      await query(
        `INSERT INTO progress (user_id, assignment_id, status)
         VALUES ($1, $2, 'in_progress')
         ON CONFLICT (user_id, assignment_id) 
         DO UPDATE SET status = 'in_progress'`,
        [user_id, assignment_id],
      )

      return result.rows[0]
    }
  }

  // Update submission status
  static async updateStatus(id, status) {
    const result = await query(
      "UPDATE submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id],
    )
    return result.rows[0]
  }
}

module.exports = Submission
