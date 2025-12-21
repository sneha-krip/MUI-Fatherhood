# Man Up! Inc. - Fatherhood Initiative

A complete participant registration and management system for the Fatherhood Initiative program.

## 🎯 Quick Links

| Page | URL | Purpose |
|------|-----|---------|
| **Signup Form** | `signup.html` | Public registration form for fathers |
| **Admin Dashboard** | `admin.html` | Staff portal to manage participants |

---

## 🚀 Quick Start

### Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard/project/zagzyiyhomvwhhsibbxv
2. Navigate to **SQL Editor** → **New Query**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create the table

### Step 2: Test Locally

Open `signup.html` in a browser (right-click → "Open with Live Server" or double-click)

### Step 3: Deploy to Web

Upload these files to any web hosting:
- `signup.html` → The public signup form
- `admin.html` → The admin dashboard

---

## 📋 Features

### Signup Form (`signup.html`)
- ✅ Clean, professional design with Man Up! Inc. branding
- ✅ Form validation with helpful error messages
- ✅ Beautiful "Thank You" confirmation screen
- ✅ Mobile responsive
- ✅ Debug mode (press `Ctrl+Shift+D` to toggle)

### Admin Dashboard (`admin.html`)
- ✅ View all registered participants
- ✅ **Add participants manually** (from paper signup sheets!)
- ✅ Edit participant information
- ✅ Delete participants
- ✅ Update status (pending → contacted → enrolled → active)
- ✅ Search by name, email, or phone
- ✅ Filter by status and entry source
- ✅ Export to CSV for Excel/Google Sheets
- ✅ Statistics dashboard

---

## 📊 Database Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Auto-generated unique ID |
| `full_name` | Text | Participant's full name (required) |
| `email` | Text | Email address (required, unique) |
| `phone` | Text | Phone number (required) |
| `year_of_birth` | Integer | Birth year |
| `num_children` | Integer | Number of children |
| `children_ages` | Text | Ages like "5, 8, 12" |
| `referral_source` | Text | How they heard about us |
| `goals` | Text | What they hope to gain |
| `newsletter_opt_in` | Boolean | Email subscription |
| `status` | Text | pending/contacted/enrolled/active/inactive/completed |
| `entry_source` | Text | online/manual/paper/phone/event |
| `notes` | Text | Admin notes (internal) |
| `created_at` | Timestamp | Registration date |

---

## 🌐 Embedding in manupinc.org

### Option 1: Direct Link
Just link to the signup page:
```html
<a href="/fatherhood/signup.html" class="btn">Sign Up Now</a>
```

### Option 2: Iframe Embed
```html
<iframe 
    src="/fatherhood/signup.html" 
    width="100%" 
    height="800" 
    frameborder="0"
    style="border: none; max-width: 600px; margin: 0 auto; display: block;">
</iframe>
```

### Option 3: Custom Integration
The signup form can be styled to match the main site by modifying the CSS variables in `signup.html`.

---

## 🔒 Security Notes

- The current setup uses Supabase Row Level Security (RLS) with public access
- For production with sensitive data, consider adding authentication
- API keys are visible in the HTML (standard for client-side apps)
- To rotate keys: Supabase Dashboard → Settings → API → Regenerate

---

## 🎨 Branding

Colors used:
- Forest Green: `#1B5E20`
- Gold: `#C9A227`
- Cream: `#FDF8E8`

Fonts:
- Headings: Libre Baskerville (serif)
- Body: Source Sans 3

---

## 🛠️ Troubleshooting

### "Database table not found" error
Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor.

### Form submits but no thank you screen
Open browser console (F12) and check for errors. Enable debug mode with `Ctrl+Shift+D`.

### "This email is already registered"
The email already exists in the database. Use the admin dashboard to find/edit the existing entry.

### Data not showing in admin dashboard
1. Check if the table exists in Supabase
2. Verify RLS policies are set correctly
3. Try refreshing the page

---

## 📁 File Structure

```
MUI-Fatherhood/
├── signup.html          # Public signup form
├── admin.html           # Admin dashboard
├── supabase-schema.sql  # Database setup script
├── README.md            # This file
├── index.html           # (legacy - use signup.html)
├── fatherhood-admin.html # (legacy - use admin.html)
└── backend/             # Optional Node.js backend (not required)
```

---

## 📞 Support

For technical issues: Contact the developer
For program questions: fatherhood@manupinc.org

