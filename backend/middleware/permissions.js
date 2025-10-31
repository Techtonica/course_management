// Role-based access control middleware

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    console.log("Access denied: User", req.user.id, "is not admin")
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

// Check if user is admin or volunteer
const requireAdminOrVolunteer = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "volunteer") {
    console.log("Access denied: User", req.user.id, "is not admin or volunteer")
    return res.status(403).json({ error: "Admin or volunteer access required" })
  }
  next()
}

// Check if user is accessing their own resource or is admin
const requireOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId

  if (req.user.role === "admin" || req.user.id === resourceUserId) {
    next()
  } else {
    console.log("Access denied: User", req.user.id, "cannot access resource for user", resourceUserId)
    return res.status(403).json({ error: "Access denied" })
  }
}

// Volunteer-specific permissions (limited access)
const requireVolunteerLimitedAccess = (req, res, next) => {
  if (req.user.role === "admin") {
    // Admins have full access
    req.limitedAccess = false
    next()
  } else if (req.user.role === "volunteer") {
    // Volunteers have limited access
    req.limitedAccess = true
    next()
  } else {
    console.log("Access denied: User", req.user.id, "is not volunteer or admin")
    return res.status(403).json({ error: "Volunteer or admin access required" })
  }
}

module.exports = {
  requireAdmin,
  requireAdminOrVolunteer,
  requireOwnerOrAdmin,
  requireVolunteerLimitedAccess,
}
