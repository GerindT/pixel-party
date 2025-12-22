-- Canvas History Table (run this if you already have pixels table)
-- Run this in your Supabase SQL Editor

-- Create canvas_history table for gallery
CREATE TABLE IF NOT EXISTS canvas_history (
  id SERIAL PRIMARY KEY,
  snapshot JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE canvas_history;

-- RLS policies
ALTER TABLE canvas_history ENABLE ROW LEVEL SECURITY;

-- Anyone can read history
CREATE POLICY "Public read history" ON canvas_history
  FOR SELECT USING (true);

-- Anyone can insert (when canvas completes)
CREATE POLICY "Public insert history" ON canvas_history
  FOR INSERT WITH CHECK (true);
