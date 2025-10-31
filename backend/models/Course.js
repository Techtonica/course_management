const { query } = require("../config/database")

class Course {
  // Get all courses (public or all for admin)
  static async getAll(isPublicOnly = false) {
    let sql = "SELECT * FROM courses ORDER BY created_at DESC"
    if (isPublicOnly) {
      sql = "SELECT * FROM courses WHERE is_public = true ORDER BY created_at DESC"
    }
    const result = await query(sql)
    return result.rows
  }

  // Get course by ID
  static async getById(id) {
    const result = await query("SELECT * FROM courses WHERE id = $1", [id])
    return result.rows[0]
  }

  // Create new course
  static async create(courseData) {
    const { title, description, repo_url, is_public } = courseData
    const result = await query(
      "INSERT INTO courses (title, description, repo_url, is_public) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, repo_url, is_public || false],
    )
    return result.rows[0]
  }

  // Update course
  static async update(id, courseData) {
    const { title, description, repo_url, is_public } = courseData
    const result = await query(
      "UPDATE courses SET title = $1, description = $2, repo_url = $3, is_public = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [title, description, repo_url, is_public, id],
    )
    return result.rows[0]
  }

  // Delete course
  static async delete(id) {
    await query("DELETE FROM courses WHERE id = $1", [id])
    return { message: "Course deleted successfully" }
  }
}

module.exports = Course
