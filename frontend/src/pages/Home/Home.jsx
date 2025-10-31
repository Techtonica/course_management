"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Button from "../../components/common/Button/Button"
import "./Home.css"

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard
      switch (user.role) {
        case "admin":
          navigate("/admin")
          break
        case "volunteer":
          navigate("/volunteer")
          break
        case "participant":
          navigate("/participant")
          break
        default:
          break
      }
    }
  }, [user, navigate])

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Welcome to Course Management</h1>
        <p className="home-subtitle">Track your progress, submit assignments, and receive feedback all in one place.</p>

        {!user && (
          <div className="home-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => (window.location.href = "http://localhost:5000/api/auth/github")}
            >
              Login with GitHub
            </Button>
          </div>
        )}
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>Track Progress</h3>
          <p>Monitor your assignment completion with visual progress indicators.</p>
        </div>

        <div className="feature-card">
          <h3>Submit Work</h3>
          <p>Easily submit your GitHub repository links for each assignment.</p>
        </div>

        <div className="feature-card">
          <h3>Get Feedback</h3>
          <p>Receive detailed feedback from instructors and mentors.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
