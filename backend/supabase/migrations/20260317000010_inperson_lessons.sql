-- Add in-person lesson type and location fields

-- Add location columns to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS location_name TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS location_address TEXT;

-- Update the type constraint to allow 'in_person'
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_type_check;
ALTER TABLE lessons ADD CONSTRAINT lessons_type_check
    CHECK (type IN ('video', 'meeting', 'pdf', 'presentation', 'quiz', 'assignment', 'in_person', 'exam'));
