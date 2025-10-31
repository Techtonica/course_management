-- Test data, file ran after running the migration script

-- Insert test admin user
INSERT INTO users (github_id, github_username, email, name, avatar_url, role) VALUES
('admin123', 'admin_user', 'admin@example.com', 'Admin User', 'https://avatars.githubusercontent.com/u/1', 'admin');

-- Insert test volunteer user
INSERT INTO users (github_id, github_username, email, name, avatar_url, role) VALUES
('volunteer123', 'volunteer_user', 'volunteer@example.com', 'Volunteer Mentor', 'https://avatars.githubusercontent.com/u/2', 'volunteer');

-- Insert test participant users
INSERT INTO users (github_id, github_username, email, name, avatar_url, role) VALUES
('participant123', 'participant_one', 'participant1@example.com', 'Participant One', 'https://avatars.githubusercontent.com/u/3', 'participant'),
('participant456', 'participant_two', 'participant2@example.com', 'Participant Two', 'https://avatars.githubusercontent.com/u/4', 'participant');

-- Insert test course
INSERT INTO courses (title, description, repo_url, is_public) VALUES
('Software Engineering Fundamentals', 'Learn the basics of software engineering including Git, JavaScript, and web development.', 'https://github.com/example/se-fundamentals', true);

-- Insert test assignments (using the course_id from above)
INSERT INTO assignments (course_id, title, description, due_date, github_instruction_url, order_num)
SELECT 
    id,
    'Git Basics',
    'Learn Git version control fundamentals',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    'https://github.com/example/se-fundamentals/blob/main/assignments/01-git-basics.md',
    1
FROM courses WHERE title = 'Software Engineering Fundamentals';

INSERT INTO assignments (course_id, title, description, due_date, github_instruction_url, order_num)
SELECT 
    id,
    'JavaScript Functions',
    'Master JavaScript functions and scope',
    CURRENT_TIMESTAMP + INTERVAL '14 days',
    'https://github.com/example/se-fundamentals/blob/main/assignments/02-js-functions.md',
    2
FROM courses WHERE title = 'Software Engineering Fundamentals';

-- Insert test survey template
INSERT INTO survey_templates (assignment_id, questions)
SELECT 
    id,
    '[
        {
            "id": "difficulty",
            "type": "dropdown",
            "label": "How difficult was this assignment?",
            "options": ["Very Easy", "Easy", "Moderate", "Hard", "Very Hard"],
            "required": true,
            "info": "Rate the overall difficulty level of this assignment"
        },
        {
            "id": "time_spent",
            "type": "text",
            "label": "Approximately how many hours did you spend?",
            "required": true,
            "info": "Estimate the total time spent on this assignment"
        },
        {
            "id": "concepts_clear",
            "type": "radio",
            "label": "Were the concepts explained clearly?",
            "options": ["Yes", "Somewhat", "No"],
            "required": true,
            "info": "Evaluate the clarity of instructions and concepts"
        },
        {
            "id": "helpful_resources",
            "type": "checkbox",
            "label": "Which resources were most helpful?",
            "options": ["Documentation", "Video tutorials", "Office hours", "Peer discussion", "Other"],
            "required": false,
            "info": "Select all resources that helped you complete this assignment"
        },
        {
            "id": "feedback",
            "type": "text",
            "label": "Additional feedback or suggestions",
            "required": false,
            "info": "Share any additional thoughts about this assignment"
        }
    ]'::jsonb
FROM assignments WHERE title = 'Git Basics';
