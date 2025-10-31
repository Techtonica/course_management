const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notificationController")
const { authenticateToken } = require("../middleware/auth")

// All routes require authentication
router.use(authenticateToken)

// Get all notifications for authenticated user
router.get("/", notificationController.getNotifications)

// Get unread notification count
router.get("/unread-count", notificationController.getUnreadCount)

// Mark notification as read
router.put("/:id/read", notificationController.markAsRead)

// Mark all notifications as read
router.put("/mark-all-read", notificationController.markAllAsRead)

module.exports = router
