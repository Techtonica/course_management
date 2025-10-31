"use client"

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error) {
      console.error("Authentication error:", error)
      navigate("/")
      return
    }

    if (token) {
      login(token)
      // Navigation will happen automatically via AuthContext
    } else {
      navigate("/")
    }
  }, [searchParams, navigate, login])

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Authenticating...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  )
}

export default AuthCallback
