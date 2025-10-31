const pool = require("../config/database")

class Notification {
  // Create a new notification
  static async create(userId, type, content) {
    const query = `
      INSERT INTO notifications (user_id, type, content, read, created_at)
      VALUES ($1, $2, $3, false, NOW())
      RETURNING *
    `
    const values = [userId, type, content]
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Get all notifications for a user
  static async getByUserId(userId, limit = 50) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `
    const result = await pool.query(query, [userId, limit])
    return result.rows
  }

  // Get unread notifications count
  static async getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND read = false
    `
    const result = await pool.query(query, [userId])
    return Number.parseInt(result.rows[0].count)
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications
      SET read = true
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `
    const result = await pool.query(query, [notificationId, userId])
    return result.rows[0]
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET read = true
      WHERE user_id = $1 AND read = false
      RETURNING *
    `
    const result = await pool.query(query, [userId])
    return result.rows
  }

  // Delete old notifications (older than 90 days)
  static async deleteOld() {
    const query = `
      DELETE FROM notifications
      WHERE created_at < NOW() - INTERVAL '90 days'
      RETURNING *
    `
    const result = await pool.query(query)
    return result.rows
  }
}

module.exports = Notification
