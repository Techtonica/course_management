const express = require("express")
const router = express.Router()
const passport = require("../config/github-oauth")
const { generateToken } = require("../middleware/auth")

// GitHub OAuth login route
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))

// GitHub OAuth callback route
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user)

    console.log("User authenticated successfully:", req.user.email)

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  },
)

// Get current user info (requires authentication)
router.get("/me", require("../middleware/auth").authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    github_username: req.user.github_username,
    avatar_url: req.user.avatar_url,
  })
})

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" })
    }
    res.json({ message: "Logged out successfully" })
  })
})

module.exports = router
