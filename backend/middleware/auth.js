const jwt = require("jsonwebtoken")
require("dotenv").config()

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  // Bearer TOKEN
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err.message)
      return res.status(403).json({ error: "Invalid or expired token" })
    }

    req.user = user
    console.log("Authenticated user:", user.id, "Role:", user.role)
    next()
  })
}

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    github_username: user.github_username,
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

module.exports = {
  authenticateToken,
  generateToken,
}
