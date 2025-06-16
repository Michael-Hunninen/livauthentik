-- Update reward tiers to new structure: Gold (0-999), Platinum (1000-1999), Diamond (2000+)

-- First, remove any existing reward tiers
TRUNCATE TABLE reward_tiers RESTART IDENTITY CASCADE;

-- Insert the new reward tiers
INSERT INTO reward_tiers (name, min_points, benefits, created_at)
VALUES 
  ('Gold', 0, ARRAY[
    '5% off all purchases',
    'Free shipping on orders $75+',
    'Exclusive member content',
    'Birthday reward'
  ], NOW()),
  
  ('Platinum', 1000, ARRAY[
    '10% off all purchases',
    'Free shipping on all orders',
    'Early access to sales',
    'Priority customer support',
    'Birthday reward + gift'
  ], NOW()),
  
  ('Diamond', 2000, ARRAY[
    '15% off all purchases',
    'Free express shipping',
    'Exclusive products access',
    'VIP customer support',
    'Birthday month 20% off',
    'Free gift with every order'
  ], NOW());

-- Function to update user tiers based on their points
CREATE OR REPLACE FUNCTION update_user_tiers()
RETURNS void AS $$
BEGIN
  -- Update tiers for all users based on their points
  UPDATE user_rewards ur
  SET 
    current_tier_id = rt.id,
    updated_at = NOW()
  FROM reward_tiers rt
  WHERE ur.points_balance >= rt.min_points
  AND NOT EXISTS (
    SELECT 1 
    FROM reward_tiers higher_tier
    WHERE higher_tier.min_points > rt.min_points
    AND ur.points_balance >= higher_tier.min_points
  );
  
  -- For users with points below the minimum tier (shouldn't happen, but just in case)
  UPDATE user_rewards
  SET current_tier_id = (SELECT id FROM reward_tiers WHERE min_points = 0 LIMIT 1)
  WHERE current_tier_id IS NULL;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update all user tiers
SELECT update_user_tiers();

-- Drop the temporary function
DROP FUNCTION IF EXISTS update_user_tiers();

-- Add a trigger to automatically update tiers when points change
CREATE OR REPLACE FUNCTION update_user_tier_on_points_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Find the appropriate tier based on points
  SELECT id INTO NEW.current_tier_id
  FROM reward_tiers rt
  WHERE rt.min_points <= NEW.points_balance
  ORDER BY rt.min_points DESC
  LIMIT 1;
  
  -- If no tier found (shouldn't happen), set to lowest tier
  IF NEW.current_tier_id IS NULL THEN
    NEW.current_tier_id := (SELECT id FROM reward_tiers ORDER BY min_points ASC LIMIT 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'trigger_update_user_tier_on_points_change'
  ) THEN
    CREATE TRIGGER trigger_update_user_tier_on_points_change
    BEFORE UPDATE OF points_balance ON user_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_user_tier_on_points_change();
  END IF;
END $$;
