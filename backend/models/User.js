const { query } = require("../config/database")

class User {
  // Get all users (admin only)
  static async getAll() {
    const result = await query(
      "SELECT id, github_username, email, name, avatar_url, role, created_at FROM users ORDER BY created_at DESC",
    )
    return result.rows
  }

  // Get user by ID
  static async getById(id) {
    const result = await query(
      "SELECT id, github_username, email, name, avatar_url, role, created_at FROM users WHERE id = $1",
      [id],
    )
    return result.rows[0]
  }

  // Get user by GitHub ID
  static async getByGithubId(githubId) {
    const result = await query("SELECT * FROM users WHERE github_id = $1", [githubId])
    return result.rows[0]
  }

  // Update user role (admin only)
  static async updateRole(id, role) {
    const result = await query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, github_username, email, name, avatar_url, role",
      [role, id],
    )
    return result.rows[0]
  }

  // Get participants only
  static async getParticipants() {
    const result = await query(
      "SELECT id, github_username, email, name, avatar_url, created_at FROM users WHERE role = 'participant' ORDER BY name",
    )
    return result.rows
  }
}

module.exports = User
