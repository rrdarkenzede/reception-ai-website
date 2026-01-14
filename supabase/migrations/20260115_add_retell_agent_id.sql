-- Migration: Add retell_agent_id for multi-tenant routing
-- Date: 2026-01-15
-- Description: Enables dynamic agent routing by storing Retell Agent ID per restaurant

-- Add retell_agent_id column for multi-tenant routing
ALTER TABLE restaurants 
ADD COLUMN retell_agent_id TEXT UNIQUE;

-- Add comment for documentation
COMMENT ON COLUMN restaurants.retell_agent_id IS 
  'Retell Dashboard Agent ID for dynamic routing. Found in Retell agent URL.';

-- Create index for fast lookups (partial index on non-null values)
CREATE INDEX idx_restaurants_retell_agent_id 
ON restaurants(retell_agent_id) 
WHERE retell_agent_id IS NOT NULL;
