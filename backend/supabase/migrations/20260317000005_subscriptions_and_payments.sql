-- Migration for Subscriptions and Plan Management

-- 1. Subscription Plans (Platform level)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- Starter, Pro, Enterprise
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2),
  max_instructors INTEGER NOT NULL,
  max_students INTEGER NOT NULL,
  max_courses INTEGER NOT NULL,
  storage_gb INTEGER,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Academy Subscriptions (Academy level)
CREATE TABLE IF NOT EXISTS academy_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(academy_id)
);

-- 3. Payments/Transactions log
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES academies(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- success, failed, pending
  provider TEXT DEFAULT 'instapaylink',
  provider_tx_id TEXT, -- external transaction ID
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view plans" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Super Admins can manage plans" ON subscription_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Admins can view their own academy subscription" ON academy_subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM academies WHERE id = academy_id AND owner_id = auth.uid())
);

CREATE POLICY "Admins can view their own academy payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM academies WHERE id = academy_id AND owner_id = auth.uid())
);

-- Seed initial plans
INSERT INTO subscription_plans (name, description, price_monthly, max_instructors, max_students, max_courses)
VALUES 
('Starter', 'Perfect for small academies starting out.', 29.00, 2, 100, 5),
('Pro', 'Ideal for growing educational institutions.', 99.00, 10, 1000, 50),
('Enterprise', 'Unlimited potential for large organizations.', 299.00, 100, 10000, 500)
ON CONFLICT (name) DO NOTHING;
