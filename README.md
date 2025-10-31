# Course Management System

__A comprehensive software engineering program course management system built with PostgreSQL, Express, React, and Node.js for managing assignments, submissions, feedback, and progress tracking.__

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- GitHub OAuth App credentials
- SMTP email service (Gmail, SendGrid, etc.)

### Feature by User Role
**Public:**
- Public roadmap showing course schedule
- View course curriculum and assignment timeline
- No authentication required

**Participant:**
- Submit feedback about assignments (difficulty survey)
- View curriculum/assignment instructions (links to GitHub repo)
- Filter assignments (completed, pending, graded)
- Submit assignments via GitHub URLs
- View assigned assignments (past, present, upcoming)
- Track progress with visual indicators
- Receive feedback from staff and volunteers
- Complete surveys about assignment difficulty
- View upcoming assignments and deadlines
- Real-time notifications for new assignments and feedback

**Admin/Staff:**
- Create/edit/delete courses and assignments
- Assign assignments to all participants at once
- View all submissions
- Give grades and feedback on submissions
- Filter submissions (graded, ungraded, by participant)
- View survey results and participant progress
- Export data to CSV spreadsheets
- Manage user roles and permissions

**Volunteer Mentor:**
- View all participants with limited data access
- Provide feedback on submissions
- Track participant progress
- Limited access compared to administrators

### Production Deployment
- Set `NODE_ENV=production` in environment variables, in backend
- Update `FRONTEND_URL` to production URL, in backend
- Frontend Build: `npm run build`
- Set production environment variables:
    - Database connection (production PostgreSQL)
    - GitHub OAuth (update callback URL to production)
    - SMTP credentials
    - JWT secret (use a strong, unique secret)
    - Frontend URL (production domain)

### Starter Notes
**Database Creation and Connection**
1. Open PostgreSQL command line or pgAdmin: `psql -U postgres;`
2. Create a PostgreSQL database: `CREATE DATABASE course_management;`
3. Run the migration script: `psql -U postgres -d course_management -f migrations/001_initial_schema.sql`
4 (Optional) Seed test data: `psql -U postgres -d course_management -f seeds/test_data.sql`
5. Create a .env file with your database credentials
    - Database credentials
    - GitHub OAuth credentials (see GitHub OAuth Setup below)
    - JWT secret
    - SMTP email credentials
    - Frontend URL    
4. Run the migration scripts with `npm run migrate` -or- create a new migration:
    ```bash
    cd backend/migrations
    # Create new file: 002_migration_name.sql
    psql -U postgres -d course_management -f 002_migration_name.sql
    ```

<!-- **Package Installation**
- Backend: `npm install express pg cors dotenv bcrypt jsonwebtoken express-validator`
- Frontend: `npm install react react-dom react-router-dom axios` -->

### Technical Stack
**Backend**
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Passport.js** - GitHub OAuth authentication
- **JWT** - Token-based authentication
- **Nodemailer** - Email notifications
- **json2csv** - CSV export functionality

**Frontend**
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

**Run App Locally**
- Backend
    - Install packages: `npm install`
    - Create `.env` file from example: `cp .env.example .env`
    - Port 5000
    - `npm run dev`
    - Runs with nodemon for auto-restart
- Frontend
    - Install packages: `npm install`
    - Port 3000
    - `npm run dev`
    - Runs Vite dev server with HMR
- Configure ports and CORS

### Frontend File Structure

```plaintext
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── InfoTooltip.jsx (hover icon with description bubble)
│   │   │   ├── Button.jsx (cursor pointer on hover)
│   │   │   ├── ProgressIndicator.jsx (green checkmarks)
│   │   │   └── NotificationBell.jsx (for email notifications)
│   │   ├── auth/
│   │   │   └── GitHubLogin.jsx (OAuth flow)
│   │   ├── participant/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AssignmentList.jsx
│   │   │   ├── AssignmentCard.jsx
│   │   │   ├── SubmissionForm.jsx (GitHub URL submission)
│   │   │   ├── FeedbackView.jsx (view received feedback)
│   │   │   ├── ProgressTracker.jsx (visual progress with checkmarks)
│   │   │   └── SurveyForm.jsx (configurable survey inputs)
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CourseManager.jsx (CRUD courses)
│   │   │   ├── AssignmentManager.jsx (CRUD assignments)
│   │   │   ├── BulkAssignForm.jsx (assign to all participants)
│   │   │   ├── SubmissionReview.jsx (view all submissions)
│   │   │   ├── FeedbackForm.jsx (give structured + free-form feedback)
│   │   │   ├── SurveyBuilder.jsx (create configurable surveys)
│   │   │   ├── SurveyResults.jsx (view aggregated survey data)
│   │   │   └── ExportButton.jsx (CSV download)
│   │   ├── volunteer/
│   │   │   ├── VolunteerDashboard.jsx
│   │   │   ├── ParticipantList.jsx (all participants, limited data)
│   │   │   ├── LimitedSubmissionView.jsx (can't see all details)
│   │   │   └── GiveFeedback.jsx (can give feedback)
│   │   └── public/
│   │       └── PublicRoadmap.jsx (no auth required)
│   ├── pages/
│   │   ├── Home.jsx (landing page with GitHub login)
│   │   ├── ParticipantDashboard.jsx (route: /participant)
│   │   ├── AdminDashboard.jsx (route: /admin)
│   │   ├── VolunteerDashboard.jsx (route: /volunteer)
│   │   └── Roadmap.jsx (route: /roadmap - public)
│   ├── services/
│   │   └── api.js (axios configuration with auth headers)
│   ├── context/
│   │   └── AuthContext.jsx (user state, role, GitHub profile)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useNotifications.js
│   └── styles/
│       ├── theme.js (color palette + typography)
│       └── globals.css
```

### Backend File Structure
```plaintext
backend/
├── config/
│   ├── database.js (PostgreSQL connection pool)
│   ├── github-oauth.js (Passport GitHub strategy)
│   └── email.js (Nodemailer SMTP config)
├── middleware/
│   ├── auth.js (JWT verification)
│   └── permissions.js (RBAC: admin/volunteer/participant)
├── routes/
│   ├── auth.js (GitHub OAuth callback, JWT generation)
│   ├── users.js
│   ├── courses.js
│   ├── assignments.js
│   ├── submissions.js
│   ├── feedback.js
│   ├── progress.js
│   ├── surveys.js (templates + responses)
│   ├── notifications.js
│   └── export.js (CSV generation)
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── assignmentController.js
│   ├── submissionController.js
│   ├── feedbackController.js
│   ├── progressController.js
│   ├── surveyController.js
│   └── notificationController.js
├── models/
│   ├── User.js (database queries)
│   ├── Course.js
│   ├── Assignment.js
│   ├── Submission.js
│   ├── Feedback.js
│   ├── Progress.js
│   ├── Survey.js
│   └── Notification.js
├── utils/
│   ├── emailService.js (send notification emails)
│   ├── csvExport.js (generate CSV from data)
│   └── validators.js (input validation helpers)
├── migrations/
│   └── 001_initial_schema.sql
├── seeds/
│   └── test_data.sql
├── .env.example
├── package.json
└── server.js
```

### Backend API Endpoints

**Authentication**
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - OAuth callback
- `GET /api/auth/me` - Get current user

**Courses**
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

**Assignments**
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment (admin)
- `POST /api/assignments/bulk-assign` - Assign to all participants (admin)

**Submissions**
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions/export` - Export to CSV (admin)

**Feedback**
- `GET /api/feedback/:submissionId` - Get feedback
- `POST /api/feedback` - Create feedback (admin/volunteer)

**Progress**
- `GET /api/progress/:userId` - Get user progress
- `PUT /api/progress` - Update progress

**Surveys**
- `POST /api/surveys/templates` - Create survey template (admin)
- `POST /api/surveys/responses` - Submit survey response
- `GET /api/surveys/results/:assignmentId` - View results (admin)

**Notifications**
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### GitHub Login Integration
1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details (local URLS):
   - **Application name**: Course Management System
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**
3. Add credentials to the `backend/.env` file:
    ```plaintext
    GITHUB_CLIENT_ID=your_client_id
    GITHUB_CLIENT_SECRET=your_client_secret
    ```
4. Implement OAuth callback handling

### Email Configuration
**G-Mail SMTP**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Add to `backend/.env`:
    ```plaintext
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email@gmail.com
    SMTP_PASSWORD=your_app_password_here
    SMTP_FROM=Course Management <noreply@coursemanagement.com>
    ```

**Using Other SMTP Services**
1. Sign up for email service
2. Get API key or SMTP credentials
3. Add to .env file
4. Configure email templates + SMTP settings in `backend/.env` according to your email provider's documentation.

### DB Schema / Tables

```plaintext
1. users (user accounts with GitHub OAuth)
   - id (PRIMARY KEY)
   - github_id (UNIQUE, for OAuth)
   - github_username
   - email
   - name
   - avatar_url
   - role (ENUM: 'participant', 'volunteer', 'admin')
   - created_at

2. courses (course information)
   - id (PRIMARY KEY)
   - title
   - description
   - repo_url (GitHub repo for course materials)
   - is_public (BOOLEAN - for public roadmap)
   - created_at
   - updated_at

3. assignments (assignment details and instructions)
   - id (PRIMARY KEY)
   - course_id (FOREIGN KEY → courses)
   - title
   - description
   - due_date
   - github_instruction_url (link to assignment instructions)
   - order (for sequencing)
   - created_at

4. submissions (participant assignment submissions)
   - id (PRIMARY KEY)
   - assignment_id (FOREIGN KEY → assignments)
   - user_id (FOREIGN KEY → users)
   - github_url (participant's submission URL)
   - submitted_at
   - status (ENUM: 'pending', 'reviewed', 'needs_revision')
   - updated_at

5. feedback (feedback on submissions: structured + free-form)
   - id (PRIMARY KEY)
   - submission_id (FOREIGN KEY → submissions)
   - reviewer_id (FOREIGN KEY → users)
   - rating (INTEGER 1-5, structured feedback)
   - category (TEXT - e.g., 'code_quality', 'completeness')
   - content (TEXT - free-form feedback)
   - created_at

6. progress (participant progress tracking)
   - id (PRIMARY KEY)
   - user_id (FOREIGN KEY → users)
   - assignment_id (FOREIGN KEY → assignments)
   - status (ENUM: 'not_started', 'in_progress', 'completed')
   - completed_at

7. survey_templates (configurable survey questions per assignment)
   - id (PRIMARY KEY)
   - assignment_id (FOREIGN KEY → assignments)
   - questions (JSONB - array of question objects with type, label, options)
   - created_at

8. survey_responses (participant survey answers)
   - id (PRIMARY KEY)
   - survey_template_id (FOREIGN KEY → survey_templates)
   - user_id (FOREIGN KEY → users)
   - responses (JSONB - answers to questions)
   - created_at

9. notifications (in-app and email notifications)
   - id (PRIMARY KEY)
   - user_id (FOREIGN KEY → users)
   - type (ENUM: 'new_assignment', 'feedback_received', 'assignment_due')
   - content (TEXT)
   - read (BOOLEAN)
   - created_at
```

### Testing
- Write and run unit tests
    - Testing Library Installation: `npm install --save-dev jest supertest @testing-library/react`
    - Run Tests: `npm test`
- Perform integration testing
- User acceptance testing

### Troubleshooting

**Database Connection Issues**
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l`

**GitHub OAuth Issues**
- Verify callback URL matches GitHub OAuth app settings
- Check Client ID and Secret in `.env`
- Ensure frontend URL is correct

**Email Not Sending**
- Verify SMTP credentials
- Check email service allows SMTP access
- For Gmail, ensure App Password is used (not regular password)

**CORS Issues**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `backend/server.js`

### Design System

**Color Palette**
- **Primary**: Bondi Blue (#0093B5)
- **Secondary**: Indigo (#05556D)
- **Accent**: Spiro Disco Ball (#16C1F3), Pumpkin (#FC7625)
- **Neutrals**: Black (#000000), White (#FFFFFF)

**Typography**
- **Font Family**: Lato
- **Base Size**: 19.2px
- **Line Height**: 1.5 (28.88px)

