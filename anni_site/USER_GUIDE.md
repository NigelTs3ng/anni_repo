# Gacha Memories - User Guide 💕

Complete guide on how to use your memory gachapon app!

---

## 🚀 Getting Started

### First Time Setup

1. **Make sure Supabase is configured**
   - Follow the `SUPABASE_SETUP.md` guide if you haven't already
   - Your `.env` file should have your Supabase credentials

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Go to: http://localhost:5173
   - You should see the homepage with hearts! 💕

---

## 👤 Admin Interface

### Logging In

1. **Go to Admin Login**
   - Navigate to: http://localhost:5173/admin/login
   - Or click any admin link from the homepage

2. **Enter Credentials**
   - **Email**: The email you created in Supabase (Step 5 of setup)
   - **Password**: The password you set for that user
   - Click **"Login"**

3. **You're In!**
   - You'll be redirected to the Admin Dashboard

---

## 📝 Creating Memories

### Step 1: Create a New Memory

1. **From the Dashboard**
   - Click the big **"+ Create New Memory"** button

2. **Fill in Memory Details**
   - **Memory ID** ⚠️ **Important!**
     - This will be used in the URL: `/memory/YOUR_ID`
     - Examples: `001`, `first-date`, `anniversary-2024`, `beach-trip`
     - Must be unique - no spaces, use hyphens if needed
     - This is what you'll put in your QR codes!
   
   - **Title**
     - The main title for this memory
     - Example: "Our First Date" or "8th Anniversary Celebration"
   
   - **Description** (Optional)
     - Write about this memory
     - Can be multiple paragraphs
     - Supports line breaks
   
   - **Cover Image** (Optional)
     - Upload a main image for this memory
     - Will be displayed prominently on the memory page

3. **Create the Memory**
   - Click **"Create Memory"**
   - You'll be taken to the edit page

### Step 2: Add Photos & Videos

1. **On the Edit Page**
   - Scroll down to **"Upload Media"** section

2. **Upload Files**
   - Click the file input
   - Select one or more photos/videos
   - Supported formats:
     - **Images**: JPG, PNG, GIF, WebP
     - **Videos**: MP4, WebM, MOV
   - Files will upload automatically

3. **View Your Media**
   - Photos appear in a grid below
   - Videos appear as playable video players
   - You can delete any media by hovering and clicking "Delete"

### Step 3: Edit Memory Details

1. **Update Title or Description**
   - Edit the fields in the **"Memory Details"** section
   - Click **"Save Changes"** when done

2. **View Public Page**
   - Click **"View Public Page"** link at the top
   - This opens the memory page as visitors will see it
   - Perfect for testing before creating QR codes!

---

## 🎯 Managing Memories

### Viewing All Memories

1. **From Dashboard**
   - See all your memories listed
   - Each shows:
     - Title
     - Description preview
     - Memory ID
     - Creation date

2. **Click Any Memory**
   - Opens the edit page for that memory

### Editing a Memory

1. **Click on a Memory** from the dashboard
2. **Make Changes**
   - Update title/description
   - Upload more media
   - Delete unwanted media
3. **Save Changes**
   - Click **"Save Changes"** for text updates
   - Media uploads/deletes happen automatically

### Deleting Media

1. **On the Edit Page**
   - Hover over any photo or video
   - Click the **"Delete"** button that appears
   - Confirm deletion
   - Media is removed from both storage and database

---

## 🌐 Public Memory Pages

### How They Work

1. **Each Memory Has a Unique URL**
   - Format: `https://your-domain.com/memory/MEMORY_ID`
   - Example: `https://your-domain.com/memory/001`
   - Example: `https://your-domain.com/memory/first-date`

2. **What Visitors See**
   - Beautiful pink-themed page
   - Memory title and date
   - Description
   - Cover image (if set)
   - Photo gallery (grid layout)
   - Video players
   - Back button to homepage

3. **Mobile Optimized**
   - Designed for mobile devices
   - Responsive grid for photos
   - Touch-friendly interface

---

## 📱 Setting Up QR Codes

### Step 1: Get Your Deployed URL

1. **Deploy to Vercel** (or your hosting)
   - Follow deployment instructions in README.md
   - Get your live URL (e.g., `https://gacha-memories.vercel.app`)

2. **Or Use Local URL for Testing**
   - For testing: `http://localhost:5173`
   - Note: This only works on your computer!

### Step 2: Create QR Code URLs

For each memory, create a URL like:
```
https://your-domain.com/memory/001
https://your-domain.com/memory/first-date
https://your-domain.com/memory/anniversary-2024
```

### Step 3: Generate QR Codes

1. **Use a QR Code Generator**
   - Online: [qr-code-generator.com](https://www.qr-code-generator.com)
   - Or use any QR code app on your phone

2. **For Each Memory**
   - Enter the full URL: `https://your-domain.com/memory/MEMORY_ID`
   - Generate QR code
   - Download as image

3. **Print & Attach**
   - Print QR codes
   - Attach to keychains, cards, or gifts
   - Each QR code links to its unique memory!

---

## 💡 Tips & Best Practices

### Memory IDs

- **Use Descriptive IDs**
  - Good: `first-date`, `anniversary-2024`, `beach-trip`
  - Avoid: `memory1`, `test`, `abc123`
  
- **Keep IDs Short**
  - Shorter = easier to type if needed
  - Easier to remember

- **No Spaces**
  - Use hyphens: `first-date` ✅
  - Not: `first date` ❌

### Photos & Videos

- **Photo Tips**
  - Use high-quality images
  - Recommended: 1080p or higher
  - Keep file sizes reasonable (< 10MB per image)
  
- **Video Tips**
  - Keep videos short (under 2 minutes ideal)
  - Compress videos if they're very large
  - MP4 format works best

- **Organization**
  - Upload photos in the order you want them displayed
  - First uploaded = first shown

### Descriptions

- **Write Meaningfully**
  - Tell the story of the memory
  - Include dates, places, feelings
  - Use line breaks for readability

- **Formatting**
  - Line breaks are preserved
  - Keep paragraphs short for mobile reading

---

## 🔐 Security Notes

### Admin Access

- **Keep Your Password Safe**
  - Don't share admin credentials
  - Only you should have access to `/admin` routes

### Public Access

- **Anyone Can View Memories**
  - Memory pages are public (by design)
  - Anyone with the URL can see the memory
  - This is intentional for QR code sharing!

- **Only You Can Edit**
  - Only authenticated admins can create/edit/delete
  - Public users can only view

---

## 🎨 Customization Ideas

### Memory Themes

Create memories for:
- 💕 Special dates (anniversaries, birthdays)
- 🌴 Trips and vacations
- 🎉 Celebrations and milestones
- 📸 Photo collections
- 💌 Love letters or messages
- 🎁 Gift reveals

### QR Code Ideas

- **Keychains**: Attach QR codes to physical keychains
- **Cards**: Print QR codes on anniversary cards
- **Gifts**: Include QR codes with presents
- **Scavenger Hunts**: Hide QR codes around the house
- **Photo Albums**: Add QR codes to physical photos

---

## 🐛 Troubleshooting

### Can't Log In

- **Check Credentials**
  - Make sure email/password are correct
  - Check Supabase to verify user exists
  
- **Check Supabase Setup**
  - Verify user was created with "Auto Confirm" checked
  - Try creating a new user if needed

### Photos Won't Upload

- **Check File Size**
  - Try a smaller image
  - Compress if needed
  
- **Check Storage Setup**
  - Verify `memories` bucket exists in Supabase
  - Check that bucket is set to Public
  - Verify storage policies are set

### Memory Page Shows "Not Found"

- **Check Memory ID**
  - Make sure the ID in the URL matches exactly
  - IDs are case-sensitive
  
- **Check Database**
  - Go to Supabase Table Editor
  - Verify the memory exists in `memories` table

### Can't See Uploaded Media

- **Refresh the Page**
  - Media might need a moment to process
  
- **Check Browser Console**
  - Open DevTools (F12)
  - Look for error messages
  
- **Verify Storage**
  - Check Supabase Storage to see if files uploaded
  - Verify `memory_media` table has records

---

## 📋 Quick Reference

### Important URLs

- **Homepage**: `/`
- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin`
- **Create Memory**: `/admin/memory/create`
- **Edit Memory**: `/admin/memory/:id`
- **View Memory**: `/memory/:id`

### Keyboard Shortcuts

- **SQL Editor**: `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows) to run queries

### File Limits

- **Recommended Image Size**: < 10MB
- **Recommended Video Size**: < 50MB
- **Supported Formats**: JPG, PNG, GIF, WebP, MP4, WebM, MOV

---

## 🎉 You're Ready!

You now know how to:
- ✅ Create beautiful memories
- ✅ Upload photos and videos
- ✅ Generate QR codes
- ✅ Share your memories

**Happy 8th Anniversary! 💕💖💗**

Enjoy creating your personalized memory gachapon experience!

