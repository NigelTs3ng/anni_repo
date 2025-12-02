# Database Update: Add Keychain Image Field

To enable keychain image uploads, you need to add a new column to the `memories` table in Supabase.

## Steps to Update Database

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to **SQL Editor**

2. **Run This SQL Query**

```sql
-- Add keychain_image_url column to memories table
ALTER TABLE memories 
ADD COLUMN IF NOT EXISTS keychain_image_url TEXT;

-- Add a comment to explain the column
COMMENT ON COLUMN memories.keychain_image_url IS 'URL to the keychain portrait image displayed below description';
```

3. **Verify the Update**
   - Go to **Table Editor**
   - Click on the `memories` table
   - You should see a new column `keychain_image_url` (it will be empty/null for existing records)

## What This Does

- Adds a new `keychain_image_url` column that stores the URL of the keychain image
- This column is optional (nullable), so existing memories won't break
- The keychain image will be uploaded to Supabase storage (same as other media)
- The image will be displayed below the description on the memory page

## After Running the SQL

1. Refresh your admin panel
2. Edit any memory
3. You'll see a new "Keychain Image (Portrait)" field
4. Upload a keychain image - it will be stored in Supabase storage
5. The image will appear below the description on the memory page

## Notes

- The keychain image is uploaded to the same `memories` storage bucket
- Images are automatically resized to fit (max height 400px, maintains aspect ratio)
- The image has no borders or boxes - it's displayed cleanly
- Portrait orientation works best for keychain images

