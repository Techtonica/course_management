"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import Button from "../Button/Button"
import NotificationBell from "../NotificationBell/NotificationBell"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const getDashboardLink = () => {
    if (!user) return null

    switch (user.role) {
      case "admin":
        return "/admin"
      case "volunteer":
        return "/volunteer"
      case "participant":
        return "/participant"
      default:
        return "/"
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Course Management
        </Link>

        <div className="navbar-menu">
          <Link to="/roadmap" className="navbar-link">
            Roadmap
          </Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} className="navbar-link">
                Dashboard
              </Link>
              <NotificationBell />
              <div className="navbar-user">
                <img
                  src={user.avatar_url || "/placeholder.svg?height=32&width=32"}
                  alt={user.name}
                  className="navbar-avatar"
                />
                <span className="navbar-username">{user.name}</span>
              </div>
              <Button variant="outline" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={() => (window.location.href = "http://localhost:5000/api/auth/github")}
            >
              Login with GitHub
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
