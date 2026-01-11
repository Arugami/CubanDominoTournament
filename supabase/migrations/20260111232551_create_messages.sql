-- Chat messages table for tournament hype
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  player_name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient time-based queries (newest first)
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Enable Row Level Security (but allow all for this simple use case)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Messages are viewable by everyone"
  ON messages FOR SELECT
  USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
