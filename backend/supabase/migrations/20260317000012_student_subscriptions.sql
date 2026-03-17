-- Migration: Student subscription plans
-- Students can subscribe to a plan (gets N courses included) OR enroll per-course individually

CREATE TABLE IF NOT EXISTS student_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'trialing')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  courses_used INTEGER NOT NULL DEFAULT 0,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT now() + INTERVAL '1 month',
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_id UUID REFERENCES payments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id) -- one active subscription per student
);

-- Track which subscription courses a student used their plan slots for
CREATE TABLE IF NOT EXISTS subscription_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES student_subscriptions(id),
  access_type TEXT NOT NULL DEFAULT 'subscription' CHECK (access_type IN ('subscription', 'individual')),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Add student course limit to subscription_plans (how many courses per student subscription)
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS student_course_limit INTEGER NOT NULL DEFAULT 5;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing plans with student course limits
UPDATE subscription_plans SET student_course_limit = 3, sort_order = 1 WHERE name = 'Starter';
UPDATE subscription_plans SET student_course_limit = 10, sort_order = 2 WHERE name = 'Pro';
UPDATE subscription_plans SET student_course_limit = 999, sort_order = 3 WHERE name = 'Enterprise';

-- Enable RLS
ALTER TABLE student_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_course_access ENABLE ROW LEVEL SECURITY;

-- Student can view/manage their own subscription
CREATE POLICY "Students can view their subscription" ON student_subscriptions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert their subscription" ON student_subscriptions FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update their subscription" ON student_subscriptions FOR UPDATE USING (student_id = auth.uid());

-- Students can view their own course access records
CREATE POLICY "Students can view their course access" ON subscription_course_access FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert course access" ON subscription_course_access FOR INSERT WITH CHECK (student_id = auth.uid());

-- Super admin can manage all subscriptions
CREATE POLICY "Super admin full access to student_subscriptions" ON student_subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "Super admin full access to subscription_course_access" ON subscription_course_access FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Function: check if student can access a course
CREATE OR REPLACE FUNCTION student_can_access_course(p_student_id UUID, p_course_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_enrolled BOOLEAN;
  v_subscription_active BOOLEAN;
  v_courses_used INTEGER;
  v_course_limit INTEGER;
BEGIN
  -- Check direct enrollment (individual purchase)
  SELECT EXISTS (
    SELECT 1 FROM enrollments WHERE student_id = p_student_id AND course_id = p_course_id
  ) INTO v_enrolled;
  IF v_enrolled THEN RETURN TRUE; END IF;

  -- Check subscription course access record
  SELECT EXISTS (
    SELECT 1 FROM subscription_course_access WHERE student_id = p_student_id AND course_id = p_course_id
  ) INTO v_enrolled;
  IF v_enrolled THEN RETURN TRUE; END IF;

  RETURN FALSE;
END;
$$;
