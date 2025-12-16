# Man Up! Inc. Fatherhood Initiative - Complete Setup Guide

## ⚠️ SECURITY WARNING
- **NEVER** commit your `.env` file or Supabase credentials to GitHub
- **ROTATE** your Supabase keys immediately after initial setup
- Use different API keys for development and production environments

---

## STEP 4: CREATE SUPABASE TABLE

Go to your **Supabase Dashboard** → **SQL Editor** → **New Query** and run:

```sql
-- ============================================
-- FATHERHOOD INITIATIVE DATABASE SCHEMA
-- Man Up! Inc. - Complete Backend Support
-- ============================================

-- Create the fatherhood_signups table
CREATE TABLE fatherhood_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT,
    zip_code TEXT,
    number_of_children INTEGER,
    children_ages JSONB,
    referral_source TEXT,
    interests JSONB,
    availability TEXT,
    additional_notes TEXT,
    consent_to_contact BOOLEAN DEFAULT true,
    consent_to_sms BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'enrolled', 'inactive', 'completed')),
    signup_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create unique index on email (case-insensitive)
CREATE UNIQUE INDEX idx_fatherhood_email ON fatherhood_signups(LOWER(email));

-- Create index on status for filtering
CREATE INDEX idx_fatherhood_status ON fatherhood_signups(status);

-- Create index on created_at for sorting
CREATE INDEX idx_fatherhood_created_at ON fatherhood_signups(created_at DESC);

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function on updates
CREATE TRIGGER update_fatherhood_signups_updated_at 
    BEFORE UPDATE ON fatherhood_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE fatherhood_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for signups)
CREATE POLICY "Enable insert for public signups" 
    ON fatherhood_signups FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow authenticated users to read (admin dashboard)
CREATE POLICY "Enable read for authenticated users only" 
    ON fatherhood_signups FOR SELECT 
    USING (auth.role() = 'authenticated');

-- ============================================
-- OPTIONAL: For demo/development without auth
-- ============================================
-- Uncomment the line below to allow anonymous SELECT (demo only!)
-- CREATE POLICY "Allow anonymous select (DEMO)" ON fatherhood_signups FOR SELECT USING (true);
```

---

## Database Schema Reference

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier (auto-generated) |
| full_name | TEXT | Participant's full name |
| email | TEXT | Email address (unique, case-insensitive) |
| phone_number | TEXT | Phone number |
| address | TEXT | Street address (optional) |
| zip_code | TEXT | ZIP code (optional) |
| number_of_children | INTEGER | Number of children (optional) |
| children_ages | JSONB | Array of children's ages (optional) |
| referral_source | TEXT | How they heard about us (optional) |
| interests | JSONB | Array of interests (optional) |
| availability | TEXT | Preferred schedule (optional) |
| additional_notes | TEXT | Any additional information (optional) |
| consent_to_contact | BOOLEAN | Permission to contact (default: true) |
| consent_to_sms | BOOLEAN | Permission for SMS (default: false) |
| status | TEXT | Signup status: pending/contacted/enrolled/inactive/completed |
| signup_date | TIMESTAMP | When they signed up |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time (auto-updated) |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/fatherhood/signup` | POST | Submit new signup |
| `/api/fatherhood/signups` | GET | List all signups (admin) |
| `/api/fatherhood/signups/:id` | GET | Get specific signup (admin) |
| `/api/fatherhood/signups/:id/status` | PATCH | Update signup status (admin) |
| `/api/fatherhood/stats` | GET | Get signup statistics (admin) |

---

## Testing the Backend

### 1. Start the server
```bash
cd backend
npm run dev
```

### 2. Test health endpoint
```bash
curl http://localhost:3001/health
```

### 3. Test signup
```bash
curl -X POST http://localhost:3001/api/fatherhood/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Father",
    "email": "test@example.com",
    "phone_number": "555-123-4567",
    "consent_to_contact": true
  }'
```

### 4. Verify in Supabase
Go to **Supabase Dashboard** → **Table Editor** → **fatherhood_signups**

---

## Post-Setup Security Checklist

- [ ] Run SQL schema in Supabase
- [ ] Test signup endpoint works
- [ ] Verify data appears in Supabase
- [ ] **ROTATE your Supabase keys**
- [ ] Remove demo SELECT policy for production
- [ ] Set up proper authentication for admin endpoints
