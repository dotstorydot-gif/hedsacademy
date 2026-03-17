-- Migration for Lesson Discussions

CREATE TABLE IF NOT EXISTS lesson_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE lesson_discussions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone enrolled in the course can view discussions" 
  ON lesson_discussions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN modules m ON l.module_id = m.id
      JOIN enrollments e ON m.course_id = e.course_id
      WHERE l.id = lesson_discussions.lesson_id AND e.student_id = auth.uid()
    )
    OR 
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'support')
    )
  );

CREATE POLICY "Users can post their own messages to discussions" 
  ON lesson_discussions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON lesson_discussions FOR DELETE
  USING (auth.uid() = user_id);
