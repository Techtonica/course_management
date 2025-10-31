const { query } = require("../config/database")

class Assignment {
  // Get all assignments for a course
  static async getByCourseId(courseId) {
    const result = await query("SELECT * FROM assignments WHERE course_id = $1 ORDER BY order_num", [courseId])
    return result.rows
  }

  // Get all assignments (for admin)
  static async getAll() {
    const result = await query(`
      SELECT a.*, c.title as course_title 
      FROM assignments a 
      JOIN courses c ON a.course_id = c.id 
      ORDER BY c.title, a.order_num
    `)
    return result.rows
  }

  // Get assignment by ID
  static async getById(id) {
    const result = await query(
      `
      SELECT a.*, c.title as course_title, c.repo_url as course_repo_url
      FROM assignments a 
      JOIN courses c ON a.course_id = c.id 
      WHERE a.id = $1
    `,
      [id],
    )
    return result.rows[0]
  }

  // Create new assignment
  static async create(assignmentData) {
    const { course_id, title, description, due_date, github_instruction_url, order_num } = assignmentData
    const result = await query(
      "INSERT INTO assignments (course_id, title, description, due_date, github_instruction_url, order_num) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [course_id, title, description, due_date, github_instruction_url, order_num],
    )
    return result.rows[0]
  }

  // Update assignment
  static async update(id, assignmentData) {
    const { title, description, due_date, github_instruction_url, order_num } = assignmentData
    const result = await query(
      "UPDATE assignments SET title = $1, description = $2, due_date = $3, github_instruction_url = $4, order_num = $5 WHERE id = $6 RETURNING *",
      [title, description, due_date, github_instruction_url, order_num, id],
    )
    return result.rows[0]
  }

  // Delete assignment
  static async delete(id) {
    await query("DELETE FROM assignments WHERE id = $1", [id])
    return { message: "Assignment deleted successfully" }
  }

  // Bulk assign to all participants
  static async bulkAssignToParticipants(assignmentId) {
    const result = await query(
      `
      INSERT INTO progress (user_id, assignment_id, status)
      SELECT u.id, $1, 'not_started'
      FROM users u
      WHERE u.role = 'participant'
      ON CONFLICT (user_id, assignment_id) DO NOTHING
      RETURNING *
    `,
      [assignmentId],
    )
    return result.rows
  }
}

module.exports = Assignment
