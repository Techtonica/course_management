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
1. users (id, email, password_hash, role, name, created_at)
2. courses (id, title, description, repo_url, is_public, created_at)
3. assignments (id, course_id, title, description, due_date, github_url, order)
4. submissions (id, assignment_id, user_id, github_url, submitted_at, status)
5. feedback (id, submission_id, reviewer_id, content, rating, created_at)
6. progress (id, user_id, assignment_id, status, completed_at)
7. surveys (id, assignment_id, user_id, difficulty_rating, comments, created_at)

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
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── InfoTooltip.jsx (hover icon with description)
│   │   ├── Button.jsx (with cursor pointer on hover)
│   │   └── ProgressIndicator.jsx (green checkmarks)
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── participant/
│   │   ├── Dashboard.jsx
│   │   ├── AssignmentList.jsx
│   │   ├── AssignmentCard.jsx
│   │   ├── SubmissionForm.jsx
│   │   ├── FeedbackView.jsx
│   │   └── ProgressTracker.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── CourseManager.jsx
│   │   ├── AssignmentManager.jsx
│   │   ├── BulkAssignForm.jsx
│   │   ├── SubmissionReview.jsx
│   │   ├── FeedbackForm.jsx
│   │   └── ExportButton.jsx
│   └── public/
│       └── PublicRoadmap.jsx
├── pages/
│   ├── Home.jsx
│   ├── ParticipantDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── Roadmap.jsx
├── services/
│   └── api.js (axios configuration)
├── context/
│   └── AuthContext.jsx
└── styles/
    └── theme.js (color palette & typography)
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

