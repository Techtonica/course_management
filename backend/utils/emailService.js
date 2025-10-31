const transporter = require("../config/email")

class EmailService {
  // Send email notification for new assignment
  async sendNewAssignmentNotification(user, assignment) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `New Assignment: ${assignment.title}`,
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0093B5; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0;">New Assignment Available</h1>
          </div>
          <div style="padding: 30px; background-color: #FFFFFF;">
            <h2 style="color: #05556D;">${assignment.title}</h2>
            <p style="color: #000000; line-height: 1.6;">${assignment.description}</p>
            <p style="color: #05556D;"><strong>Due Date:</strong> ${new Date(assignment.due_date).toLocaleDateString()}</p>
            ${
              assignment.github_instruction_url
                ? `
              <p>
                <a href="${assignment.github_instruction_url}" 
                   style="color: #0093B5; text-decoration: none;">
                  View Assignment Instructions →
                </a>
              </p>
            `
                : ""
            }
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/participant" 
                 style="background-color: #0093B5; color: #FFFFFF; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Dashboard
              </a>
            </div>
          </div>
          <div style="background-color: #F8F9FA; padding: 20px; text-align: center; color: #05556D; font-size: 14px;">
            <p>You're receiving this because you're enrolled in the Software Engineering Program.</p>
          </div>
        </div>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`New assignment email sent to ${user.email}`)
    } catch (error) {
      console.error("Error sending new assignment email:", error)
      throw error
    }
  }

  // Send email notification for feedback received
  async sendFeedbackNotification(user, submission, feedback) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Feedback Received: ${submission.assignment_title}`,
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0093B5; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0;">New Feedback Received</h1>
          </div>
          <div style="padding: 30px; background-color: #FFFFFF;">
            <h2 style="color: #05556D;">${submission.assignment_title}</h2>
            <p style="color: #05556D;"><strong>Reviewer:</strong> ${feedback.reviewer_name}</p>
            ${
              feedback.rating
                ? `
              <p style="color: #05556D;"><strong>Rating:</strong> ${"⭐".repeat(feedback.rating)}</p>
            `
                : ""
            }
            ${
              feedback.category
                ? `
              <p style="color: #05556D;"><strong>Category:</strong> ${feedback.category.replace("_", " ")}</p>
            `
                : ""
            }
            <div style="background-color: #F8F9FA; padding: 15px; border-left: 4px solid #0093B5; margin: 20px 0;">
              <p style="color: #000000; line-height: 1.6; margin: 0;">${feedback.content}</p>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/participant" 
                 style="background-color: #0093B5; color: #FFFFFF; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                View Full Feedback
              </a>
            </div>
          </div>
          <div style="background-color: #F8F9FA; padding: 20px; text-align: center; color: #05556D; font-size: 14px;">
            <p>You're receiving this because you submitted work for review.</p>
          </div>
        </div>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`Feedback email sent to ${user.email}`)
    } catch (error) {
      console.error("Error sending feedback email:", error)
      throw error
    }
  }

  // Send email notification for assignment due soon
  async sendAssignmentDueNotification(user, assignment, daysUntilDue) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Reminder: ${assignment.title} Due Soon`,
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FC7625; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0;">Assignment Due Soon</h1>
          </div>
          <div style="padding: 30px; background-color: #FFFFFF;">
            <h2 style="color: #05556D;">${assignment.title}</h2>
            <p style="color: #FC7625; font-size: 18px; font-weight: bold;">
              Due in ${daysUntilDue} ${daysUntilDue === 1 ? "day" : "days"}!
            </p>
            <p style="color: #000000; line-height: 1.6;">${assignment.description}</p>
            <p style="color: #05556D;"><strong>Due Date:</strong> ${new Date(assignment.due_date).toLocaleDateString()}</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/participant" 
                 style="background-color: #FC7625; color: #FFFFFF; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Submit Assignment
              </a>
            </div>
          </div>
          <div style="background-color: #F8F9FA; padding: 20px; text-align: center; color: #05556D; font-size: 14px;">
            <p>Don't forget to submit your work before the deadline!</p>
          </div>
        </div>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`Due date reminder email sent to ${user.email}`)
    } catch (error) {
      console.error("Error sending due date reminder email:", error)
      throw error
    }
  }
}

module.exports = new EmailService()
