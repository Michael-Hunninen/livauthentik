-- Supabase Database Schema for LivAuthentik E-commerce Platform

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price INTEGER NOT NULL, -- Stored in cents
  subscription_price INTEGER, -- Stored in cents
  is_subscription_only BOOLEAN DEFAULT FALSE,
  category TEXT,
  image_url TEXT,
  gallery TEXT[],
  features TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Product variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stripe_price_id TEXT,
  stripe_subscription_price_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Stored in cents
  subscription_price INTEGER, -- Stored in cents
  badge TEXT,
  features TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Customers table (links Supabase users to Stripe customers)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_checkout_id TEXT,
  stripe_customer_id TEXT,
  amount INTEGER, -- Stored in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  is_subscription BOOLEAN DEFAULT FALSE,
  shipping_address JSONB,
  billing_address JSONB,
  product_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL, -- Price at time of purchase, in cents
  name TEXT NOT NULL, -- Product name at time of purchase
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  price_amount INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  interval TEXT, -- month, year, etc.
  status TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User rewards
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Reward transactions
CREATE TABLE reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL, -- purchase, subscription_created, renewal_payment, etc.
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Products: Anyone can view active products, only admins can modify
CREATE POLICY "Anyone can view active products" 
  ON products FOR SELECT 
  USING (active = TRUE);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Subscriptions: Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- Rewards: Users can view their own rewards
CREATE POLICY "Users can view their own rewards" 
  ON user_rewards FOR SELECT 
  USING (auth.uid() = user_id);

-- Create trigger function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp triggers
CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_product_variants_modtime
BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customers_modtime
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subscriptions_modtime
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_rewards_modtime
BEFORE UPDATE ON user_rewards
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
