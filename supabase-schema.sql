-- ============================================
-- MAN UP! INC. FATHERHOOD INITIATIVE
-- Complete Database Schema for Supabase
-- Project ID: zagzyiyhomvwhhsibbxv
-- ============================================

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS fatherhood_signups CASCADE;

-- Create the fatherhood_signups table
CREATE TABLE fatherhood_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core fields (required)
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Demographics
    year_of_birth INTEGER,
    num_children INTEGER,
    children_ages TEXT,  -- Comma-separated ages like "5, 8, 12"
    
    -- Referral & interests
    referral_source TEXT,
    goals TEXT,
    
    -- Contact preferences
    newsletter_opt_in BOOLEAN DEFAULT true,
    
    -- Admin fields
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'enrolled', 'active', 'inactive', 'completed')),
    notes TEXT,  -- Admin notes field
    entry_source TEXT DEFAULT 'online' CHECK (entry_source IN ('online', 'manual', 'paper', 'phone', 'event')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on email (case-insensitive)
CREATE UNIQUE INDEX idx_fatherhood_email ON fatherhood_signups(LOWER(email));

-- Create indexes for common queries
CREATE INDEX idx_fatherhood_status ON fatherhood_signups(status);
CREATE INDEX idx_fatherhood_created_at ON fatherhood_signups(created_at DESC);
CREATE INDEX idx_fatherhood_full_name ON fatherhood_signups(full_name);

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_fatherhood_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_fatherhood_signups_updated_at ON fatherhood_signups;
CREATE TRIGGER update_fatherhood_signups_updated_at 
    BEFORE UPDATE ON fatherhood_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_fatherhood_updated_at();

-- Enable Row Level Security
ALTER TABLE fatherhood_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for online signups)
CREATE POLICY "Allow public inserts" 
    ON fatherhood_signups FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow public selects (for admin dashboard - using anon key)
-- NOTE: For production, you should implement proper auth
CREATE POLICY "Allow public selects" 
    ON fatherhood_signups FOR SELECT 
    USING (true);

-- Policy: Allow public updates (for admin dashboard status changes)
CREATE POLICY "Allow public updates" 
    ON fatherhood_signups FOR UPDATE 
    USING (true);

-- Policy: Allow public deletes (for admin to remove entries)
CREATE POLICY "Allow public deletes" 
    ON fatherhood_signups FOR DELETE 
    USING (true);

-- ============================================
-- VERIFICATION QUERIES (run after creating table)
-- ============================================

-- Test insert
-- INSERT INTO fatherhood_signups (full_name, email, phone, year_of_birth, num_children)
-- VALUES ('Test Dad', 'test@example.com', '555-123-4567', 1985, 2);

-- Verify table exists and structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'fatherhood_signups';

-- ============================================
-- NOTES FOR PRODUCTION
-- ============================================
-- 1. After testing, consider restricting SELECT/UPDATE/DELETE to authenticated users
-- 2. Rotate your API keys after initial setup
-- 3. Set up email notifications for new signups using Supabase Edge Functions

