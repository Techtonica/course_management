const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy
const { query } = require("./database")
require("dotenv").config()

// Configure GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub OAuth callback received for user:", profile.username)

        // Extract user information from GitHub profile
        const githubId = profile.id
        const githubUsername = profile.username
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.user`
        const name = profile.displayName || profile.username
        const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null

        // Check if user exists
        const userResult = await query("SELECT * FROM users WHERE github_id = $1", [githubId])

        let user
        if (userResult.rows.length > 0) {
          // User exists, update their information
          user = userResult.rows[0]
          await query(
            "UPDATE users SET github_username = $1, email = $2, name = $3, avatar_url = $4 WHERE github_id = $5",
            [githubUsername, email, name, avatarUrl, githubId],
          )
          console.log("Updated existing user:", user.id)
        } else {
          // New user, create with default role 'participant'
          const newUserResult = await query(
            "INSERT INTO users (github_id, github_username, email, name, avatar_url, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [githubId, githubUsername, email, name, avatarUrl, "participant"],
          )
          user = newUserResult.rows[0]
          console.log("Created new user:", user.id)
        }

        return done(null, user)
      } catch (error) {
        console.error("GitHub OAuth error:", error)
        return done(error, null)
      }
    },
  ),
)

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id])
    done(null, result.rows[0])
  } catch (error) {
    done(error, null)
  }
})

module.exports = passport
