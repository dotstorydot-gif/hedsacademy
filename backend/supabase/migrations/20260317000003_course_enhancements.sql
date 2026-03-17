-- Migration to enhance course management features

-- Add pricing and metadata to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add ordering to modules
ALTER TABLE modules ADD COLUMN IF NOT EXISTS sequence_order INTEGER DEFAULT 0;

-- Add ordering and content type to lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS sequence_order INTEGER DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'article', 'quiz', 'assignment'));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_modules_sequence ON modules(course_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_lessons_sequence ON lessons(module_id, sequence_order);
