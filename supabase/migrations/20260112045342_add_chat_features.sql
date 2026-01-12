-- Add new columns to messages table for chat features
-- Avatar: stores user's selected pixel avatar
-- Reactions: JSONB storing emoji reactions with user lists
-- Is_pinned: boolean for pinned messages

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'domino',
ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- Create index for pinned messages (frequently queried)
CREATE INDEX IF NOT EXISTS idx_messages_is_pinned ON messages(is_pinned) WHERE is_pinned = true;
