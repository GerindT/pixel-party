-- PixelParty Database Schema (with Gallery)
-- Run this in your Supabase SQL Editor

-- ========== PIXELS TABLE ==========

-- 1. Drop existing policies if re-running
DROP POLICY IF EXISTS "Public read access" ON pixels;
DROP POLICY IF EXISTS "Public update access" ON pixels;
DROP POLICY IF EXISTS "Anyone can read pixels" ON pixels;
DROP POLICY IF EXISTS "Authenticated can update pixels" ON pixels;

-- 2. Create pixels table
CREATE TABLE IF NOT EXISTS pixels (
  id SERIAL PRIMARY KEY,
  x INT NOT NULL,
  y INT NOT NULL,
  color TEXT DEFAULT '#1a1a2e',
  updated_by UUID,
  change_count INT DEFAULT 0,
  UNIQUE(x, y)
);

-- 3. Seed 400 pixels (20x20 grid) if not exists
INSERT INTO pixels (x, y)
SELECT x, y 
FROM generate_series(0, 19) AS x, generate_series(0, 19) AS y
ON CONFLICT (x, y) DO NOTHING;

-- 4. Enable realtime for pixels table
ALTER PUBLICATION supabase_realtime ADD TABLE pixels;

-- 5. Row Level Security (RLS) - Allow anonymous access
ALTER TABLE pixels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON pixels
  FOR SELECT USING (true);

CREATE POLICY "Public update access" ON pixels
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- ========== CANVAS HISTORY TABLE ==========

-- 6. Create canvas_history table for gallery
CREATE TABLE IF NOT EXISTS canvas_history (
  id SERIAL PRIMARY KEY,
  snapshot JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Enable realtime for canvas_history (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE canvas_history;

-- 8. RLS for canvas_history
ALTER TABLE canvas_history ENABLE ROW LEVEL SECURITY;

-- Anyone can read history
CREATE POLICY "Public read history" ON canvas_history
  FOR SELECT USING (true);

-- Anyone can insert (when canvas completes)
CREATE POLICY "Public insert history" ON canvas_history
  FOR INSERT WITH CHECK (true);
