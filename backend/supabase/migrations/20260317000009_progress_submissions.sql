-- Migration: Add enrollments and quiz submissions tables
-- Note: lesson_completions already exists (migration 004) with student_id column
-- This migration adds enrollments and quiz_submissions tables

-- 1. Enrollments Table (referenced by the trigger in migration 004)
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    progress INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, course_id)
);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Students can see their own enrollments
CREATE POLICY "Students read own enrollments"
    ON enrollments FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can enroll"
    ON enrollments FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Instructors can see enrollments for their courses
CREATE POLICY "Instructors see course enrollments"
    ON enrollments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = enrollments.course_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- Academy admins can see all enrollments in their academy
CREATE POLICY "Academy admins see all enrollments"
    ON enrollments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('academy_admin', 'super_admin')
        )
    );

-- 2. Quiz Submissions Table
CREATE TABLE IF NOT EXISTS quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    passed BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own quiz submissions"
    ON quiz_submissions
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Instructors can see submissions for their course quizzes
CREATE POLICY "Instructors see quiz submissions"
    ON quiz_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes q
            JOIN lessons l ON q.lesson_id = l.id
            JOIN modules m ON l.module_id = m.id
            JOIN courses c ON m.course_id = c.id
            WHERE q.id = quiz_submissions.quiz_id
            AND c.instructor_id = auth.uid()
        )
    );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_student ON quiz_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz ON quiz_submissions(quiz_id);
