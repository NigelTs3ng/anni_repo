# Database Update: Add Memory Date Field

To enable manual date editing for memories, you need to add a new column to the `memories` table in Supabase.

## Steps to Update Database

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to **SQL Editor**

2. **Run This SQL Query**

```sql
-- Add memory_date column to memories table
ALTER TABLE memories 
ADD COLUMN IF NOT EXISTS memory_date TIMESTAMP WITH TIME ZONE;

-- Add a comment to explain the column
COMMENT ON COLUMN memories.memory_date IS 'Custom date for the memory (can be different from created_at)';
```

3. **Verify the Update**
   - Go to **Table Editor**
   - Click on the `memories` table
   - You should see a new column `memory_date` (it will be empty/null for existing records)

## What This Does

- Adds a new `memory_date` column that allows you to set a custom date for each memory
- If `memory_date` is not set, the app will fall back to using `created_at`
- This column is optional (nullable), so existing memories won't break

## After Running the SQL

1. Refresh your admin panel
2. Edit any memory
3. You'll see a new "Memory Date" field where you can set a custom date
4. The date you set will be displayed on the memory page instead of the creation date

## Notes

- The date field accepts any date format (YYYY-MM-DD)
- If you leave it empty, it will use the `created_at` timestamp
- You can update existing memories to set their display dates
- The date is stored in UTC timezone

