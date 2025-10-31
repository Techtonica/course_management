const { query } = require("../config/database")

class Progress {
  // Get progress for a user
  static async getByUserId(userId) {
    const result = await query(
      `
      SELECT p.*, 
             a.title as assignment_title, a.due_date, a.order_num,
             c.title as course_title,
             s.id as submission_id, s.github_url, s.status as submission_status
      FROM progress p
      JOIN assignments a ON p.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = p.user_id
      WHERE p.user_id = $1
      ORDER BY c.title, a.order_num
    `,
      [userId],
    )
    return result.rows
  }

  // Get progress for an assignment (all users)
  static async getByAssignmentId(assignmentId) {
    const result = await query(
      `
      SELECT p.*, 
             u.name as user_name, u.github_username, u.email,
             s.id as submission_id, s.github_url, s.status as submission_status
      FROM progress p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN submissions s ON s.assignment_id = p.assignment_id AND s.user_id = p.user_id
      WHERE p.assignment_id = $1
      ORDER BY u.name
    `,
      [assignmentId],
    )
    return result.rows
  }

  // Update progress status
  static async updateStatus(userId, assignmentId, status) {
    const completedAt = status === "completed" ? "CURRENT_TIMESTAMP" : "NULL"
    const result = await query(
      `UPDATE progress SET status = $1, completed_at = ${completedAt} WHERE user_id = $2 AND assignment_id = $3 RETURNING *`,
      [status, userId, assignmentId],
    )
    return result.rows[0]
  }

  // Create progress entry
  static async create(userId, assignmentId) {
    const result = await query(
      `INSERT INTO progress (user_id, assignment_id, status) 
       VALUES ($1, $2, 'not_started') 
       ON CONFLICT (user_id, assignment_id) DO NOTHING 
       RETURNING *`,
      [userId, assignmentId],
    )
    return result.rows[0]
  }
}

module.exports = Progress
