-- Function to handle reward redemption
CREATE OR REPLACE FUNCTION redeem_reward(
  p_user_id UUID,
  p_reward_id UUID,
  p_points_cost INTEGER
) 
RETURNS TABLE (
  id UUID,
  status TEXT,
  message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_redemption_id UUID;
  v_current_balance INTEGER;
  v_reward_name TEXT;
  v_reward_description TEXT;
BEGIN
  -- Start a transaction
  BEGIN
    -- Get reward details
    SELECT name, description INTO v_reward_name, v_reward_description
    FROM reward_items
    WHERE id = p_reward_id AND is_active = true;
    
    IF NOT FOUND THEN
      RETURN QUERY SELECT gen_random_uuid() as id, 'error' as status, 'Reward not found or inactive' as message;
      RETURN;
    END IF;
    
    -- Lock the user's rewards row for update
    SELECT points_balance INTO v_current_balance
    FROM user_rewards
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    -- If no rewards row exists, create one
    IF NOT FOUND THEN
      INSERT INTO user_rewards (user_id, points_balance)
      VALUES (p_user_id, 0)
      RETURNING points_balance INTO v_current_balance;
    END IF;
    
    -- Check if user has enough points
    IF v_current_balance < p_points_cost THEN
      RETURN QUERY SELECT gen_random_uuid() as id, 'error' as status, 'Not enough points' as message;
      RETURN;
    END IF;
    
    -- Create redemption record
    INSERT INTO user_reward_redemptions (
      user_id, 
      reward_item_id, 
      points_cost, 
      status
    )
    VALUES (
      p_user_id,
      p_reward_id,
      p_points_cost,
      'pending'
    )
    RETURNING id INTO v_redemption_id;
    
    -- Deduct points from user's balance
    UPDATE user_rewards
    SET 
      points_balance = points_balance - p_points_cost,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record the transaction
    INSERT INTO reward_transactions (
      user_id,
      points,
      description,
      source,
      reference_id
    ) VALUES (
      p_user_id,
      -p_points_cost,
      'Redeemed: ' || v_reward_name,
      'redemption',
      v_redemption_id::TEXT
    );
    
    -- Update user's tier if needed
    PERFORM update_user_tier(p_user_id);
    
    -- Commit the transaction
    COMMIT;
    
    -- Return success
    RETURN QUERY 
    SELECT 
      v_redemption_id as id, 
      'success' as status, 
      'Reward redeemed successfully' as message;
      
  EXCEPTION WHEN OTHERS THEN
    -- Rollback on error
    ROLLBACK;
    RETURN QUERY SELECT gen_random_uuid() as id, 'error' as status, 'An error occurred: ' || SQLERRM as message;
  END;
END;
$$;

-- Function to update user's tier based on points
CREATE OR REPLACE FUNCTION update_user_tier(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_points INTEGER;
  v_new_tier_id UUID;
BEGIN
  -- Calculate total points from transactions
  SELECT COALESCE(SUM(points), 0) INTO v_total_points
  FROM reward_transactions
  WHERE user_id = p_user_id;
  
  -- Find the appropriate tier
  SELECT id INTO v_new_tier_id
  FROM reward_tiers
  WHERE min_points <= v_total_points
  ORDER BY min_points DESC
  LIMIT 1;
  
  -- Update user's tier if it has changed
  UPDATE user_rewards
  SET 
    current_tier_id = v_new_tier_id,
    updated_at = NOW()
  WHERE user_id = p_user_id
  AND (current_tier_id IS DISTINCT FROM v_new_tier_id);
  
  -- If no row exists yet, create one
  IF NOT FOUND THEN
    INSERT INTO user_rewards (user_id, points_balance, current_tier_id)
    VALUES (p_user_id, v_total_points, v_new_tier_id)
    ON CONFLICT (user_id) DO UPDATE
    SET current_tier_id = EXCLUDED.current_tier_id,
        updated_at = NOW();
  END IF;
END;
$$;
