# Gacha Memories 💕

A personalized memory gachapon experience for your 8th anniversary! Each QR code keychain links to a unique memory page displaying photos, videos, and text loaded dynamically from Supabase.

## Features

- 📱 **Mobile-first design** with pink/hearts theme
- 🎁 **Public memory pages** accessible via QR codes
- 🔐 **Secure admin interface** for managing memories
- 📸 **Photo & video galleries** with Supabase storage
- 💾 **Dynamic content loading** from Supabase database

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (Database + Storage + Auth)
- **Routing**: React Router v6
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### A. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: gacha-memories (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait for project to be created (2-3 minutes)

#### B. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run this SQL to create the `memories` table:

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

4. Run this SQL to create the `memory_media` table:

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

#### C. Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `memories`
4. Make it **Public** (toggle ON)
5. Click **Create bucket**

#### D. Set Storage Policies

1. Still in Storage, click on the `memories` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **For full customization**
4. Name: `Public read access`
5. Policy definition:
   ```sql
   (bucket_id = 'memories'::text) AND (true)
   ```
6. Allowed operations: ✅ SELECT
7. Click **Review** → **Save policy**

8. Create another policy:
   - Name: `Authenticated upload access`
   - Policy definition:
     ```sql
     (bucket_id = 'memories'::text) AND (auth.role() = 'authenticated')
     ```
   - Allowed operations: ✅ INSERT, ✅ UPDATE, ✅ DELETE
   - Click **Review** → **Save policy**

#### E. Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: your-admin-email@example.com
   - **Password**: choose a strong password
   - **Auto Confirm User**: ✅ (check this)
4. Click **Create user**
5. **Save these credentials** - you'll use them to log into the admin panel

#### F. Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Find:
   - **Project URL** (copy this)
   - **anon/public key** (copy this)
3. Save both - you'll need them next

### 3. Configure Environment Variables

1. In the project root, create a file named `.env`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from step 2F.

**Important**: Never commit `.env` to git! It's already in `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Test the Application

1. **Test Admin Login**:
   - Go to `/admin/login`
   - Use the credentials you created in step 2E
   - You should be redirected to the admin dashboard

2. **Create Your First Memory**:
   - Click "Create New Memory"
   - Fill in:
     - ID: `001` (or any unique identifier)
     - Title: "Our First Date"
     - Description: "The day we first met..."
   - Optionally upload a cover image
   - Click "Create Memory"

3. **Upload Media**:
   - After creating, you'll be on the edit page
   - Use "Upload Media" to add photos/videos
   - Files will be stored in Supabase storage

4. **View Public Page**:
   - Click "View Public Page" or go to `/memory/001`
   - You should see your memory with all media!

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx    # Auth guard for admin routes
├── lib/
│   ├── supabaseClient.ts     # Supabase client initialization
│   └── database.ts            # Database helper functions
├── pages/
│   ├── HomePage.tsx           # Landing page
│   ├── MemoryPage.tsx         # Public memory view
│   ├── AdminLogin.tsx         # Admin authentication
│   ├── AdminDashboard.tsx     # Admin dashboard
│   ├── AdminMemoryCreate.tsx  # Create new memory
│   └── AdminMemoryEdit.tsx    # Edit memory & upload media
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## Building for Production

```bash
npm run build
```

The `dist/` folder will contain your production-ready files.

## Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **New Project**
4. Import your GitHub repository
5. **Important**: Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Deploy**

Your site will be live! 🎉

## QR Code Setup

1. Generate QR codes pointing to: `https://your-domain.com/memory/001`
2. Replace `001` with each memory's ID
3. Print and attach to keychains!

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that variable names start with `VITE_`
- Restart dev server after adding `.env`

### "Failed to upload media"
- Check that storage bucket `memories` exists and is public
- Verify storage policies are set correctly
- Ensure you're logged in as admin

### "Memory not found"
- Check that the memory ID in the URL matches one in the database
- Verify RLS policies allow public read access

### Images/videos not loading
- Check that storage bucket is set to **Public**
- Verify file URLs are correct in `memory_media` table
- Check browser console for CORS errors

## Support

For issues or questions:
1. Check Supabase dashboard logs
2. Check browser console for errors
3. Verify all setup steps were completed

## License

Private project - Happy 8th Anniversary! 💕💖💗
