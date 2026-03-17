-- RLS Policies for HEDS Academy

-- Enable RLS (Already done in previous migration, but good to ensure)
-- alter table users enable row level security;
-- ... (etc)

-- 1. Users Policies
create policy "Super admins can do everything on users" 
on users for all
using (auth.uid() in (select id from users where role = 'super_admin'));

create policy "Users can read their own data"
on users for select
using (auth.uid() = id);

-- 2. Academies Policies
create policy "Super admins can do everything on academies"
on academies for all
using (auth.uid() in (select id from users where role = 'super_admin'));

create policy "Academy admins can manage their own academy"
on academies for all
using (auth.uid() in (select id from users where role = 'academy_admin' and academy_id = academies.id));

create policy "Students and instructors can read their own academy"
on academies for select
using (auth.uid() in (select id from users where academy_id = academies.id));

-- 3. Courses Policies
create policy "Instructors can manage their own courses"
on courses for all
using (auth.uid() = instructor_id);

create policy "Academy admins can manage all courses in their academy"
on courses for all
using (auth.uid() in (select id from users where role = 'academy_admin' and academy_id = courses.academy_id));

create policy "Students can view published courses in their academy"
on courses for select
using (status = 'published' and (auth.uid() in (select id from users where academy_id = courses.academy_id)));

-- 4. Enrollments Policies
create policy "Students can view their own enrollments"
on enrollments for select
using (auth.uid() = student_id);

create policy "Instructors can view enrollments for their courses"
on enrollments for select
using (auth.uid() in (select instructor_id from courses where id = enrollments.course_id));

-- 5. Lessons Policies
create policy "Students can view lessons for enrolled courses"
on lessons for select
using (exists (
    select 1 from enrollments 
    join modules on modules.course_id = enrollments.course_id
    where enrollments.student_id = auth.uid() and modules.id = lessons.module_id
));

-- (More policies will be added as needed for quizzes, assignments, etc.)
