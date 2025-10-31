const Notification = require("../models/Notification")

// Get all notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const limit = req.query.limit ? Number.parseInt(req.query.limit) : 50

    const notifications = await Notification.getByUserId(userId, limit)
    res.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
}

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id
    const count = await Notification.getUnreadCount(userId)
    res.json({ count })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    res.status(500).json({ error: "Failed to fetch unread count" })
  }
}

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const notification = await Notification.markAsRead(id, userId)

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json(notification)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ error: "Failed to mark notification as read" })
  }
}

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id
    const notifications = await Notification.markAllAsRead(userId)
    res.json({ message: "All notifications marked as read", count: notifications.length })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({ error: "Failed to mark all notifications as read" })
  }
}
