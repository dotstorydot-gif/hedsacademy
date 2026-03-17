-- Migration: Expand course and user profile fields

-- Add extended fields to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration_hours DECIMAL(5,1) DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sessions_count INTEGER DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS hints TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'));
ALTER TABLE courses ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_available BOOLEAN DEFAULT true;

-- Add instructor profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Add PDF support to lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS hints TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS free_preview BOOLEAN DEFAULT false;
