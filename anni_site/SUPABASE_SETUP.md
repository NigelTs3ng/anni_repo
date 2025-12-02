# Supabase Setup Guide - Step by Step 💕

Follow these steps in order to set up your Supabase backend.

---

## Step 1: Create Supabase Account & Project

1. **Go to [supabase.com](https://supabase.com)**
   - Click "Start your project" or "Sign in"
   - Sign up with GitHub, Google, or email

2. **Create a New Project**
   - Click the **"New Project"** button (usually top right)
   - Fill in the form:
     - **Name**: `gacha-memories` (or any name you like)
     - **Database Password**: 
       - ⚠️ **IMPORTANT**: Choose a strong password and **SAVE IT** somewhere safe!
       - You'll need this if you ever want to reset your database
     - **Region**: Choose the region closest to you (e.g., "US East", "EU West")
   - Click **"Create new project"**

3. **Wait for Setup** (2-3 minutes)
   - You'll see a loading screen
   - Wait until you see "Project is ready!"

---

## Step 2: Create Database Tables

### A. Create the `memories` Table

1. **Open SQL Editor**
   - In the left sidebar, click **"SQL Editor"** (icon looks like a database)
   - Click the **"New query"** button

2. **Copy and Paste This SQL**:

```sql
-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cover_image_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public memories are viewable by everyone"
  ON memories FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Authenticated users can insert memories"
  ON memories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update memories"
  ON memories FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete memories"
  ON memories FOR DELETE
  USING (auth.role() = 'authenticated');
```

3. **Run the Query**
   - Click the **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
   - You should see: "Success. No rows returned"

### B. Create the `memory_media` Table

1. **Create Another New Query**
   - Click **"New query"** again

2. **Copy and Paste This SQL**:

```sql
-- Create memory_media table
CREATE TABLE IF NOT EXISTS memory_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE memory_media ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public memory media are viewable by everyone"
  ON memory_media FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Authenticated users can insert memory media"
  ON memory_media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete memory media"
  ON memory_media FOR DELETE
  USING (auth.role() = 'authenticated');
```

3. **Run the Query**
   - Click **"Run"**
   - You should see: "Success. No rows returned"

4. **Verify Tables Were Created**
   - In the left sidebar, click **"Table Editor"**
   - You should see both `memories` and `memory_media` tables listed

---

## Step 3: Create Storage Bucket

1. **Go to Storage**
   - In the left sidebar, click **"Storage"**

2. **Create New Bucket**
   - Click the **"New bucket"** button
   - Fill in:
     - **Name**: `memories` (must be exactly this)
     - **Public bucket**: Toggle this **ON** (very important!)
   - Click **"Create bucket"**

3. **Verify Bucket Created**
   - You should see `memories` in the list of buckets

---

## Step 4: Set Storage Policies

1. **Open the Bucket**
   - Click on the `memories` bucket name

2. **Go to Policies Tab**
   - Click the **"Policies"** tab at the top

3. **Create First Policy (Public Read)**
   - Click **"New Policy"**
   - Select **"For full customization"**
   - Fill in:
     - **Policy name**: `Public read access`
     - **Allowed operation**: Check **SELECT** only
     - **Policy definition**: Copy and paste this:
       ```sql
       (bucket_id = 'memories'::text) AND (true)
       ```
   - Click **"Review"** → **"Save policy"**

4. **Create Second Policy (Authenticated Write)**
   - Click **"New Policy"** again
   - Select **"For full customization"**
   - Fill in:
     - **Policy name**: `Authenticated upload access`
     - **Allowed operations**: Check **INSERT**, **UPDATE**, and **DELETE**
     - **Policy definition**: Copy and paste this:
       ```sql
       (bucket_id = 'memories'::text) AND (auth.role() = 'authenticated')
       ```
   - Click **"Review"** → **"Save policy"**

5. **Verify Policies**
   - You should now see 2 policies listed

---

## Step 5: Create Admin User Account

1. **Go to Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click the **"Users"** tab (if not already selected)

2. **Create New User**
   - Click **"Add user"** button
   - Select **"Create new user"**

3. **Fill in User Details**
   - **Email**: Enter your email (e.g., `your-email@gmail.com`)
     - ⚠️ **Save this email** - you'll use it to log into the admin panel!
   - **Password**: Choose a strong password
     - ⚠️ **Save this password** - you'll need it to log in!
   - **Auto Confirm User**: Check this box ✅ (important!)
   - **Send magic link**: Leave unchecked

4. **Create User**
   - Click **"Create user"**
   - You should see the new user appear in the list

---

## Step 6: Get Your API Keys

1. **Go to Settings**
   - In the left sidebar, click the **gear icon** (⚙️) at the bottom
   - Click **"API"** in the settings menu

2. **Find Your Credentials**
   - Look for **"Project URL"**
     - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
     - Click the **copy icon** next to it
     - ⚠️ **Save this URL** somewhere safe!
   
   - Look for **"anon public"** key
     - It's a long string starting with `eyJ...`
     - Click the **copy icon** next to it
     - ⚠️ **Save this key** somewhere safe!

---

## Step 7: Add Credentials to Your Project

1. **Create `.env` File**
   - In your project folder (`anni_site`), create a new file named `.env`
   - Make sure it's in the root directory (same level as `package.json`)

2. **Add Your Credentials**
   - Open the `.env` file
   - Paste this template:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Replace the Placeholders**
   - Replace `your_project_url_here` with your Project URL from Step 6
   - Replace `your_anon_key_here` with your anon public key from Step 6
   
   Example:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example
   ```

4. **Save the File**
   - Make sure to save the `.env` file

---

## Step 8: Test Your Setup

1. **Restart Your Dev Server**
   - If your dev server is running, stop it (`Ctrl+C`)
   - Start it again: `npm run dev`

2. **Test Admin Login**
   - Go to: http://localhost:5173/admin/login
   - Enter the email and password you created in Step 5
   - You should be logged in and redirected to the admin dashboard!

3. **Create Your First Memory**
   - Click "Create New Memory"
   - Fill in:
     - ID: `001` (or any unique ID)
     - Title: "Test Memory"
     - Description: "This is a test"
   - Click "Create Memory"
   - You should see the edit page!

4. **Test Upload**
   - On the edit page, try uploading a photo
   - It should upload successfully!

---

## ✅ Checklist

Before you start using the app, make sure you've completed:

- [ ] Created Supabase project
- [ ] Created `memories` table with SQL
- [ ] Created `memory_media` table with SQL
- [ ] Created `memories` storage bucket (set to Public)
- [ ] Added 2 storage policies (read + write)
- [ ] Created admin user account
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file with credentials
- [ ] Tested admin login
- [ ] Tested creating a memory
- [ ] Tested uploading media

---

## 🆘 Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct values
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### "Failed to upload media"
- Check that storage bucket is named exactly `memories`
- Verify bucket is set to **Public**
- Check that both storage policies are created

### "User not found" when logging in
- Make sure you checked "Auto Confirm User" when creating the user
- Try creating a new user if needed

### Can't see tables in Table Editor
- Go back to SQL Editor and verify the queries ran successfully
- Check for any error messages

---

## 🎉 You're Done!

Once all steps are complete, your app is ready to use! You can now:
- Create memories via the admin panel
- Upload photos and videos
- Share memory pages via QR codes

Happy 8th Anniversary! 💕💖💗

