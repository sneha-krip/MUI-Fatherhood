# Setup Instructions - Fix Database Issue

## The Problem

You're seeing 0 participants in the admin dashboard because the database table either:
1. Doesn't exist yet, OR
2. Was created with the wrong schema

## The Solution

Follow these steps **exactly**:

### Step 1: Check if the table exists

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zagzyiyhomvwhhsibbxv
2. Click on **Table Editor** in the left sidebar
3. Look for a table called `fatherhood_signups`

### Step 2: Create/Recreate the table with the CORRECT schema

1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the ENTIRE contents of the file `supabase-schema.sql` from this repository
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify the table was created

1. Go back to **Table Editor**
2. Click on the `fatherhood_signups` table
3. Verify you see these columns:
   - `id` (uuid)
   - `full_name` (text)
   - `email` (text)
   - `phone` (text)
   - `year_of_birth` (int4)
   - `num_children` (int4)
   - `children_ages` (text)
   - `referral_source` (text)
   - `goals` (text)
   - `newsletter_opt_in` (bool)
   - `status` (text)
   - `entry_source` (text)
   - `notes` (text)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

### Step 4: Test the signup form

1. Open `signup.html` in your browser
2. Fill out the form with test data
3. Submit the form
4. You should see a "Thank You" screen

### Step 5: Check the admin dashboard

1. Open `admin.html` in your browser
2. You should now see the test participant you just added!

## Still Having Issues?

### Debug Mode

1. Open `signup.html` in your browser
2. Press `Ctrl+Shift+D` to enable debug mode
3. Try submitting the form
4. Look at the debug panel in the bottom right corner for error messages

### Common Error Messages

- **"Database table not found"** → Run the SQL from `supabase-schema.sql`
- **"This email is already registered"** → The email exists, try a different one or check the admin dashboard
- **Any other error** → Check your browser console (F12) for details

### Browser Console

1. Open the page (signup.html or admin.html)
2. Press F12 to open Developer Tools
3. Click the **Console** tab
4. Look for any red error messages
5. Take a screenshot and share it if you need help

## Important Notes

⚠️ **DO NOT use DATABASE_SETUP.md** - it has an OLD schema that doesn't match the current forms!

✅ **ONLY use supabase-schema.sql** - this is the correct, up-to-date schema!

The files in this repository that matter:
- ✅ `supabase-schema.sql` - CORRECT schema (use this!)
- ✅ `signup.html` - The signup form (works with supabase-schema.sql)
- ✅ `admin.html` - The admin dashboard (works with supabase-schema.sql)
- ❌ `DATABASE_SETUP.md` - OLD schema (don't use this!)

