### Starter Notes

**Database Creation and Connection**
1. Open PostgreSQL command line or pgAdmin
2. Create database: `CREATE DATABASE course_management;`
3. Create a .env file with your database credentials:
    ```plaintext
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=course_management
    DB_USER=your_username
    DB_PASSWORD=your_password
    JWT_SECRET=your_secret_key
    ```
4. Run the migration scripts with `npm run migrate`

**Package Installation**
- Backend: `npm install express pg cors dotenv bcrypt jsonwebtoken express-validator`
- Frontend: `npm install react react-dom react-router-dom axios`

**Run App Locally**
- Start both backend and frontend servers
    - Backend (port 5000): `npm run dev`
    - Frontend (port 3000): `npm start`
- Configure ports and CORS

**GitHub Login Integration**
1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create new OAuth App
3. Add credentials to .env:
    ```plaintext
    GITHUB_CLIENT_ID=your_client_id
    GITHUB_CLIENT_SECRET=your_client_secret
    ```
4. Implement OAuth callback handling

**Email Notification (SMTP configuration)**
1. Sign up for email service
2. Get API key or SMTP credentials
3. Add to .env file
4. Configure email templates

**Testing**
- Write and run unit tests
    - Testing Library Installation: `npm install --save-dev jest supertest @testing-library/react`
    - Run Tests: `npm test`
- Perform integration testing
- User acceptance testing

### DB Schema / Tables
```plaintext
1. users
   - id (PRIMARY KEY)
   - github_id (UNIQUE, for OAuth)
   - github_username
   - email
   - name
   - avatar_url
   - role (ENUM: 'participant', 'volunteer', 'admin')
   - created_at

2. courses
   - id (PRIMARY KEY)
   - title
   - description
   - repo_url (GitHub repo for course materials)
   - is_public (BOOLEAN - for public roadmap)
   - created_at
   - updated_at

3. assignments
   - id (PRIMARY KEY)
   - course_id (FOREIGN KEY → courses)
   - title
   - description
   - due_date
   - github_instruction_url (link to assignment instructions)
   - order (for sequencing)
   - created_at

4. submissions
   - id (PRIMARY KEY)
   - assignment_id (FOREIGN KEY → assignments)
   - user_id (FOREIGN KEY → users)
   - github_url (participant's submission URL)
   - submitted_at
   - status (ENUM: 'pending', 'reviewed', 'needs_revision')
   - updated_at

5. feedback
   - id (PRIMARY KEY)
   - submission_id (FOREIGN KEY → submissions)
   - reviewer_id (FOREIGN KEY → users)
   - rating (INTEGER 1-5, structured feedback)
   - category (TEXT - e.g., 'code_quality', 'completeness')
   - content (TEXT - free-form feedback)
   - created_at

6. progress
   - id (PRIMARY KEY)
   - user_id (FOREIGN KEY → users)
   - assignment_id (FOREIGN KEY → assignments)
   - status (ENUM: 'not_started', 'in_progress', 'completed')
   - completed_at

7. survey_templates
   - id (PRIMARY KEY)
   - assignment_id (FOREIGN KEY → assignments)
   - questions (JSONB - array of question objects with type, label, options)
   - created_at

8. survey_responses
   - id (PRIMARY KEY)
   - survey_template_id (FOREIGN KEY → survey_templates)
   - user_id (FOREIGN KEY → users)
   - responses (JSONB - answers to questions)
   - created_at

9. notifications
   - id (PRIMARY KEY)
   - user_id (FOREIGN KEY → users)
   - type (ENUM: 'new_assignment', 'feedback_received', 'assignment_due')
   - content (TEXT)
   - read (BOOLEAN)
   - created_at
```

### Backend API Endpoints

**Authentication:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

**Users:**
- GET /api/users (admin only)
- GET /api/users/:id
- PUT /api/users/:id

**Courses:**
- GET /api/courses (public)
- POST /api/courses (admin)
- PUT /api/courses/:id (admin)
- DELETE /api/courses/:id (admin)

**Assignments:**
- GET /api/assignments
- GET /api/assignments/:id
- POST /api/assignments (admin)
- PUT /api/assignments/:id (admin)
- POST /api/assignments/bulk (admin - assign to all)

**Submissions:**
- GET /api/submissions (filtered by user/assignment)
- POST /api/submissions
- PUT /api/submissions/:id
- GET /api/submissions/export (admin - CSV download)

**Feedback:**
- GET /api/feedback/:submissionId
- POST /api/feedback
- PUT /api/feedback/:id

**Progress:**
- GET /api/progress/:userId
- PUT /api/progress

**Surveys:**
- POST /api/surveys
- GET /api/surveys/results (admin)

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

### Feature by User Role
**Public (No Login Required):**
- [ ] View public roadmap/schedule
- [ ] See course catalog

**Participant:**
- [ ] Submit assignments via GitHub URL
- [ ] View assigned assignments (past, present, upcoming)
- [ ] Track progress with visual indicators (green checkmarks)
- [ ] Receive feedback from staff
- [ ] Submit feedback about assignments (difficulty survey)
- [ ] View curriculum/assignment instructions (links to GitHub repo)
- [ ] Filter assignments (completed, pending, graded)

**Admin/Staff:**
- [ ] Create/edit/delete courses and assignments
- [ ] Assign assignments to all participants at once
- [ ] View all submissions
- [ ] Give grades and feedback on submissions
- [ ] View survey results and feedback
- [ ] Export data to spreadsheet (CSV)
- [ ] Filter submissions (graded, ungraded, by participant)

**Volunteer Mentor:**
- [ ] View assigned participants
- [ ] Give feedback on submissions
- [ ] View participant progress

