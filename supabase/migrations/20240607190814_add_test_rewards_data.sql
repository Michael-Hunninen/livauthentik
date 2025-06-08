-- Add test rewards data for user mhunninen@gmail.com

-- First, ensure all required constraints exist
DO $$
BEGIN
    -- Ensure user_rewards has a unique constraint on user_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'user_rewards' 
        AND constraint_name = 'user_rewards_user_id_key'
    ) THEN
        ALTER TABLE user_rewards ADD CONSTRAINT user_rewards_user_id_key UNIQUE (user_id);
    END IF;

    -- Ensure reward_transactions has required constraints
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'reward_transactions' 
        AND constraint_name = 'reward_transactions_pkey'
    ) THEN
        ALTER TABLE reward_transactions ADD CONSTRAINT reward_transactions_pkey PRIMARY KEY (id);
    END IF;

    -- Add foreign key constraint for user_id in reward_transactions if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'reward_transactions' 
        AND constraint_name = 'reward_transactions_user_id_fkey'
    ) THEN
        ALTER TABLE reward_transactions 
        ADD CONSTRAINT reward_transactions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- First, get the user ID
WITH user_data AS (
  SELECT id 
  FROM auth.users 
  WHERE email = 'mhunninen@gmail.com'
  LIMIT 1
)
-- Insert user rewards record if it doesn't exist
INSERT INTO user_rewards (user_id, points_balance, current_tier_id, created_at, updated_at)
SELECT 
  user_data.id,
  2500,  -- Starting with 2500 points
  (SELECT id FROM reward_tiers WHERE name = 'Silver' LIMIT 1),
  NOW(),
  NOW()
FROM user_data
ON CONFLICT (user_id) DO UPDATE
SET 
  points_balance = 2500,
  current_tier_id = (SELECT id FROM reward_tiers WHERE name = 'Silver' LIMIT 1),
  updated_at = NOW()
WHERE user_rewards.user_id = (SELECT id FROM user_data);

-- Add some reward transactions
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1
)
INSERT INTO reward_transactions (
  user_id,
  points,
  description,
  source,
  reference_id
)
SELECT 
  user_data.id,
  points_data.points,
  points_data.description,
  points_data.source,
  gen_random_uuid()::text
FROM user_data
CROSS JOIN (
  VALUES 
    (1000, 'Welcome bonus', 'signup'),
    (500, 'First purchase', 'purchase'),
    (1000, 'Referral bonus', 'referral'),
    (500, 'Birthday bonus', 'promotion'),
    (500, 'Loyalty points', 'engagement')
) AS points_data(points, description, source);

-- Add a redemption
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1
),
reward_item AS (
  SELECT id FROM reward_items WHERE name LIKE '%5 Off%' AND is_active = true LIMIT 1
)
INSERT INTO user_reward_redemptions (
  user_id,
  reward_item_id,
  points_cost,
  status
)
SELECT 
  user_data.id,
  reward_item.id,
  500,  -- Points cost for $5 off
  'fulfilled'
FROM user_data, reward_item
WHERE NOT EXISTS (
  SELECT 1 FROM user_reward_redemptions 
  WHERE user_id = (SELECT id FROM user_data) 
  AND reward_item_id = (SELECT id FROM reward_item)
  LIMIT 1
);

-- Record the redemption transaction
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1
),
redemption AS (
  SELECT id FROM user_reward_redemptions 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1)
  LIMIT 1
)
INSERT INTO reward_transactions (
  user_id,
  points,
  description,
  source,
  reference_id
)
SELECT 
  user_data.id,
  -500,  -- Deducting points
  'Redeemed: $5 Off Next Purchase',
  'redemption',
  redemption.id::text
FROM user_data, redemption
WHERE NOT EXISTS (
  SELECT 1 FROM reward_transactions 
  WHERE reference_id = (SELECT id::text FROM redemption)
  AND source = 'redemption'
  LIMIT 1
);

-- Update user's points balance to reflect all transactions
WITH points_summary AS (
  SELECT 
    user_id,
    SUM(points) as total_points
  FROM reward_transactions
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1)
  GROUP BY user_id
)
UPDATE user_rewards
SET 
  points_balance = points_summary.total_points,
  current_tier_id = (
    SELECT id FROM reward_tiers 
    WHERE (SELECT total_points FROM points_summary) >= min_points
    ORDER BY min_points DESC 
    LIMIT 1
  ),
  updated_at = NOW()
FROM points_summary
WHERE user_rewards.user_id = points_summary.user_id;
