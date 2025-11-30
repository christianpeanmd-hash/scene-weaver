-- Drop the check constraint on subscription_tier to allow more flexibility
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

-- Add a more flexible constraint that allows our tiers
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'creator', 'pro', 'studio'));