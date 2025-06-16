-- Create or replace the redeem_reward function
CREATE OR REPLACE FUNCTION public.redeem_reward(
  p_user_id uuid,
  p_reward_id uuid
) 
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reward RECORD;
  v_user_points INTEGER;
  v_redemption_id UUID;
  v_result JSONB;
BEGIN
  -- Get reward details
  SELECT * INTO v_reward
  FROM public.reward_items
  WHERE id = p_reward_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Reward not found');
  END IF;
  
  -- Get user's current points with FOR UPDATE to lock the row
  SELECT points_balance INTO v_user_points
  FROM public.user_rewards
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    -- Initialize user rewards if not exists
    INSERT INTO public.user_rewards (user_id, points_balance)
    VALUES (p_user_id, 0)
    RETURNING points_balance INTO v_user_points;
  END IF;
  
  -- Check if user has enough points
  IF v_user_points < v_reward.points_cost THEN
    RETURN jsonb_build_object('error', 'Insufficient points');
  END IF;
  
  -- Deduct points
  UPDATE public.user_rewards
  SET 
    points_balance = points_balance - v_reward.points_cost,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING points_balance INTO v_user_points;
  
  -- Record the redemption
  INSERT INTO public.user_reward_redemptions (
    user_id, 
    reward_item_id, 
    points_cost,
    status
  ) VALUES (
    p_user_id,
    p_reward_id,
    v_reward.points_cost,
    'completed'
  )
  RETURNING id INTO v_redemption_id;
  
  -- Log the transaction
  INSERT INTO public.reward_transactions (
    user_id,
    points,
    description,
    source,
    type
  ) VALUES (
    p_user_id,
    -v_reward.points_cost, -- Negative for redemption
    'Redeemed: ' || v_reward.name,
    'redemption',
    'debit'
  );
  
  -- Return success with updated points balance
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Reward redeemed successfully',
    'points_balance', v_user_points,
    'redemption_id', v_redemption_id
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users
GRANTANT EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid) TO authenticated;
