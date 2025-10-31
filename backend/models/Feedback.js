const { query } = require("../config/database")

class Feedback {
  // Get all feedback for a submission
  static async getBySubmissionId(submissionId) {
    const result = await query(
      `
      SELECT f.*, 
             u.name as reviewer_name, u.github_username as reviewer_username, u.avatar_url as reviewer_avatar
      FROM feedback f
      JOIN users u ON f.reviewer_id = u.id
      WHERE f.submission_id = $1
      ORDER BY f.created_at DESC
    `,
      [submissionId],
    )
    return result.rows
  }

  // Create feedback
  static async create(feedbackData) {
    const { submission_id, reviewer_id, rating, category, content } = feedbackData
    const result = await query(
      "INSERT INTO feedback (submission_id, reviewer_id, rating, category, content) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [submission_id, reviewer_id, rating, category, content],
    )

    // Update submission status to 'reviewed'
    await query("UPDATE submissions SET status = 'reviewed', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [
      submission_id,
    ])

    return result.rows[0]
  }

  // Update feedback
  static async update(id, feedbackData) {
    const { rating, category, content } = feedbackData
    const result = await query(
      "UPDATE feedback SET rating = $1, category = $2, content = $3 WHERE id = $4 RETURNING *",
      [rating, category, content, id],
    )
    return result.rows[0]
  }

  // Delete feedback
  static async delete(id) {
    await query("DELETE FROM feedback WHERE id = $1", [id])
    return { message: "Feedback deleted successfully" }
  }
}

module.exports = Feedback
