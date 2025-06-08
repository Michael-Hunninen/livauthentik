-- Add reward-related tables

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Reward Tiers
CREATE TABLE reward_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  min_points INTEGER NOT NULL DEFAULT 0,
  benefits TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Reward Items
CREATE TABLE reward_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- User Rewards (replacing the old user_rewards table if it exists)
DROP TABLE IF EXISTS user_rewards CASCADE;
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_balance INTEGER NOT NULL DEFAULT 0,
  current_tier_id UUID REFERENCES reward_tiers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Reward Transactions (replacing the old reward_transactions table if it exists)
DROP TABLE IF EXISTS reward_transactions CASCADE;
CREATE TABLE reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL, -- 'purchase', 'redemption', 'adjustment', etc.
  reference_id TEXT, -- ID of the related order, reward item, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Reward Redemptions
CREATE TABLE user_reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_item_id UUID NOT NULL REFERENCES reward_items(id),
  points_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'fulfilled', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add RLS policies for the new tables
ALTER TABLE reward_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Reward Tiers: Public read access
CREATE POLICY "Anyone can view reward tiers" 
  ON reward_tiers FOR SELECT 
  USING (true);

-- Reward Items: Public read access to active items
CREATE POLICY "Anyone can view active reward items" 
  ON reward_items FOR SELECT 
  USING (is_active = true);

-- User Rewards: Users can only see their own rewards
CREATE POLICY "Users can view their own rewards" 
  ON user_rewards FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" 
  ON user_rewards FOR UPDATE 
  USING (auth.uid() = user_id);

-- Reward Transactions: Users can only see their own transactions
CREATE POLICY "Users can view their own transactions" 
  ON reward_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- User Reward Redemptions: Users can only see their own redemptions
CREATE POLICY "Users can view their own redemptions" 
  ON user_reward_redemptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions" 
  ON user_reward_redemptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add update timestamp triggers
CREATE TRIGGER update_reward_tiers_modtime
BEFORE UPDATE ON reward_tiers
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_reward_items_modtime
BEFORE UPDATE ON reward_items
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_rewards_modtime
BEFORE UPDATE ON user_rewards
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_reward_redemptions_modtime
BEFORE UPDATE ON user_reward_redemptions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Insert some initial reward tiers
INSERT INTO reward_tiers (name, min_points, benefits)
VALUES 
  ('Bronze', 0, ARRAY['5% off first purchase', 'Early access to sales']),
  ('Silver', 1000, ARRAY['10% off all purchases', 'Free shipping on orders over $50', 'Exclusive member content']),
  ('Gold', 5000, ARRAY['15% off all purchases', 'Free shipping on all orders', 'Priority customer support', 'Early access to new products']),
  ('Platinum', 10000, ARRAY['20% off all purchases', 'Free express shipping', 'Personal shopper', 'VIP event invitations']);

-- Insert some initial reward items
INSERT INTO reward_items (name, description, points_cost, is_active)
VALUES
  ('$5 Off Next Purchase', 'Save $5 on your next purchase', 500, true),
  ('Free Shipping', 'Free shipping on your next order', 750, true),
  ('20% Off Next Purchase', 'Get 20% off your next purchase', 1000, true),
  ('Free Product Sample', 'Get a free sample with your next order', 1500, true),
  ('$25 Gift Card', 'Redeem for a $25 gift card', 2500, true);

-- Create a function to get user's current tier
CREATE OR REPLACE FUNCTION get_user_tier(p_user_id UUID)
RETURNS TABLE (
  tier_id UUID,
  tier_name TEXT,
  min_points INTEGER,
  benefits TEXT[],
  next_tier_name TEXT,
  points_to_next_tier INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_points AS (
    SELECT COALESCE(SUM(points), 0) as total_points
    FROM reward_transactions
    WHERE user_id = p_user_id
  )
  SELECT 
    rt.id as tier_id,
    rt.name as tier_name,
    rt.min_points,
    rt.benefits,
    next_tier.name as next_tier_name,
    CASE 
      WHEN next_tier.min_points IS NULL THEN 0
      ELSE next_tier.min_points - up.total_points
    END as points_to_next_tier
  FROM reward_tiers rt
  CROSS JOIN user_points up
  LEFT JOIN reward_tiers next_tier ON next_tier.min_points > rt.min_points
  WHERE rt.min_points <= up.total_points
  ORDER BY rt.min_points DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
