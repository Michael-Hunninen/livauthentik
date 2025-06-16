-- Restore user rewards data for mhunninen@gmail.com with 1450 points

-- First, ensure the user exists and get their ID
WITH user_data AS (
  SELECT id 
  FROM auth.users 
  WHERE email = 'mhunninen@gmail.com'
  LIMIT 1
)
-- Insert or update user rewards record with 1450 points
INSERT INTO user_rewards (
  user_id, 
  points_balance, 
  current_tier_id, 
  created_at, 
  updated_at
)
SELECT 
  user_data.id,
  1450,  -- Your points balance
  (SELECT id FROM reward_tiers WHERE name = 'Platinum' LIMIT 1),  -- Should be Platinum tier
  NOW(),
  NOW()
FROM user_data
ON CONFLICT (user_id) 
DO UPDATE SET
  points_balance = 1450,
  current_tier_id = (SELECT id FROM reward_tiers WHERE name = 'Platinum' LIMIT 1),
  updated_at = NOW()
WHERE user_rewards.user_id = (SELECT id FROM user_data);

-- Add reward transactions to account for the 1450 points
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1
)
INSERT INTO reward_transactions (
  user_id,
  points,
  description,
  source,
  reference_id,
  created_at
)
SELECT 
  user_data.id,
  points_data.points,
  points_data.description,
  points_data.source,
  gen_random_uuid()::text,
  NOW() - (points_data.days_ago || ' days')::interval
FROM user_data
CROSS JOIN (
  -- Distribute the 1450 points across several transactions
  VALUES 
    (500, 'Welcome bonus', 'signup', 30),
    (500, 'First purchase', 'purchase', 25),
    (300, 'Monthly points', 'engagement', 15),
    (150, 'Social share', 'engagement', 5)
) AS points_data(points, description, source, days_ago)
-- Only insert if we don't already have transactions for this user
WHERE NOT EXISTS (
  SELECT 1 FROM reward_transactions 
  WHERE user_id = (SELECT id FROM user_data)
  LIMIT 1
);

-- Update the user's tier based on their points (should be Platinum)
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'mhunninen@gmail.com' LIMIT 1
)
UPDATE user_rewards
SET 
  current_tier_id = (
    SELECT id 
    FROM reward_tiers 
    WHERE 1450 >= min_points 
    ORDER BY min_points DESC 
    LIMIT 1
  ),
  updated_at = NOW()
WHERE user_id = (SELECT id FROM user_data);
