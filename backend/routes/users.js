const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")
const { requireAdmin } = require("../middleware/permissions")

// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.getAll()
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Get participants only
router.get("/participants", authenticateToken, async (req, res) => {
  try {
    const participants = await User.getParticipants()
    res.json(participants)
  } catch (error) {
    console.error("Error fetching participants:", error)
    res.status(500).json({ error: "Failed to fetch participants" })
  }
})

// Get user by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.getById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Update user role (admin only)
router.patch("/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body
    const user = await User.updateRole(req.params.id, role)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    console.log("User role updated:", user.id, "to", role)
    res.json(user)
  } catch (error) {
    console.error("Error updating user role:", error)
    res.status(500).json({ error: "Failed to update user role" })
  }
})

module.exports = router
