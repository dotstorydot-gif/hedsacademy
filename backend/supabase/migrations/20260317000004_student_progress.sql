-- Migration for tracking student lesson progress

-- Table to store individual lesson completion status
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

-- Enable RLS
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own completions"
  ON lesson_completions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert their own completions"
  ON lesson_completions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Function to update enrollment progress automatically
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  new_progress INTEGER;
BEGIN
  -- Get total lessons for the course
  SELECT count(*) INTO total_lessons
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = NEW.course_id;

  -- Get completed lessons for the user and course
  SELECT count(*) INTO completed_lessons
  FROM lesson_completions
  WHERE student_id = NEW.student_id AND course_id = NEW.course_id;

  -- Calculate progress percentage
  IF total_lessons > 0 THEN
    new_progress := (completed_lessons * 100) / total_lessons;
  ELSE
    new_progress := 0;
  END IF;

  -- Update enrollments table
  UPDATE enrollments
  SET progress = new_progress, updated_at = now()
  WHERE student_id = NEW.student_id AND course_id = NEW.course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for progress update
CREATE TRIGGER tr_update_progress_on_completion
AFTER INSERT ON lesson_completions
FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();
