-- Migration for Live Sessions Management

CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT, -- Google Meet / Jitsi URL
  provider TEXT DEFAULT 'jitsi' CHECK (provider IN ('jitsi', 'google_meet')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enrolled students can view live sessions" ON live_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments WHERE course_id = live_sessions.course_id AND student_id = auth.uid())
);

CREATE POLICY "Instructors can manage their own sessions" ON live_sessions FOR ALL USING (
  instructor_id = auth.uid()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled ON live_sessions(scheduled_at);
