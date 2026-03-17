-- Initial Schema for HEDS Academy LMS SaaS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Plans Table
create table if not exists plans (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    price numeric not null,
    max_students integer not null,
    max_courses integer not null,
    max_instructors integer not null,
    features jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- 2. Academies Table
create table if not exists academies (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    owner_id uuid, -- Reference to users table will be added after users table creation
    subscription_id uuid, -- Reference to subscriptions table will be added after subscriptions table creation
    status text check (status in ('active', 'suspended', 'pending')) default 'pending',
    created_at timestamp with time zone default now()
);

-- 3. Users Table
create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text unique not null,
    role text check (role in ('super_admin', 'academy_admin', 'instructor', 'student', 'support')) not null,
    academy_id uuid references academies(id) on delete set null,
    created_at timestamp with time zone default now()
);

-- Add foreign key to academies for owner_id
alter table academies add constraint fk_academy_owner foreign key (owner_id) references users(id) on delete set null;

-- 4. Subscriptions Table
create table if not exists subscriptions (
    id uuid primary key default uuid_generate_v4(),
    academy_id uuid references academies(id) on delete cascade,
    plan_id uuid references plans(id) on delete restrict,
    status text check (status in ('active', 'past_due', 'canceled', 'trialing')) default 'trialing',
    start_date timestamp with time zone default now(),
    end_date timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Add foreign key to academies for subscription_id
alter table academies add constraint fk_academy_subscription foreign key (subscription_id) references subscriptions(id) on delete set null;

-- 5. Courses Table
create table if not exists courses (
    id uuid primary key default uuid_generate_v4(),
    academy_id uuid references academies(id) on delete cascade,
    title text not null,
    description text,
    instructor_id uuid references users(id) on delete set null,
    price numeric default 0,
    status text check (status in ('draft', 'published', 'archived')) default 'draft',
    thumbnail_url text,
    created_at timestamp with time zone default now()
);

-- 6. Modules Table
create table if not exists modules (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references courses(id) on delete cascade,
    title text not null,
    "order" integer not null,
    created_at timestamp with time zone default now()
);

-- 7. Lessons Table
create table if not exists lessons (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references modules(id) on delete cascade,
    type text check (type in ('video', 'meeting', 'pdf', 'presentation', 'quiz', 'assignment')) not null,
    title text not null,
    video_url text,
    meeting_url text,
    presentation_url text,
    pdf_url text,
    duration integer, -- in seconds
    "order" integer not null,
    created_at timestamp with time zone default now()
);

-- 8. Quizzes Table
create table if not exists quizzes (
    id uuid primary key default uuid_generate_v4(),
    lesson_id uuid references lessons(id) on delete cascade,
    title text not null,
    passing_score integer default 70,
    created_at timestamp with time zone default now()
);

-- 9. Questions Table
create table if not exists questions (
    id uuid primary key default uuid_generate_v4(),
    quiz_id uuid references quizzes(id) on delete cascade,
    question text not null,
    type text check (type in ('multiple_choice', 'true_false', 'short_answer', 'matching')) not null,
    options jsonb,
    correct_answer text,
    created_at timestamp with time zone default now()
);

-- 10. Assignments Table
create table if not exists assignments (
    id uuid primary key default uuid_generate_v4(),
    lesson_id uuid references lessons(id) on delete cascade,
    title text not null,
    description text,
    deadline timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- 11. Submissions Table
create table if not exists submissions (
    id uuid primary key default uuid_generate_v4(),
    assignment_id uuid references assignments(id) on delete cascade,
    student_id uuid references users(id) on delete cascade,
    file_url text,
    grade numeric,
    feedback text,
    submitted_at timestamp with time zone default now()
);

-- 12. Enrollments Table
create table if not exists enrollments (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references courses(id) on delete cascade,
    student_id uuid references users(id) on delete cascade,
    progress integer default 0,
    completed boolean default false,
    enrolled_at timestamp with time zone default now(),
    completed_at timestamp with time zone,
    unique(course_id, student_id)
);

-- 13. Certificates Table
create table if not exists certificates (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid references users(id) on delete cascade,
    course_id uuid references courses(id) on delete cascade,
    certificate_url text not null,
    verification_code text unique not null,
    issued_at timestamp with time zone default now()
);

-- 14. Meetings Table
create table if not exists meetings (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references courses(id) on delete cascade,
    title text not null,
    meeting_link text,
    start_time timestamp with time zone not null,
    duration integer, -- in minutes
    created_at timestamp with time zone default now()
);

-- 15. Row Level Security (RLS) - Basic Setup
alter table users enable row level security;
alter table academies enable row level security;
alter table plans enable row level security;
alter table subscriptions enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table enrollments enable row level security;
alter table certificates enable row level security;
alter table meetings enable row level security;
