import { supabase } from './supabaseClient'

export interface Memory {
  id: string
  title: string
  description: string
  created_at: string
  memory_date: string | null
  cover_image_url: string | null
  keychain_image_url: string | null
}

export interface MemoryMedia {
  id: string
  memory_id: string
  media_url: string
  media_type: 'image' | 'video'
  created_at: string
}

// Get a single memory by ID
export async function getMemory(id: string): Promise<Memory | null> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching memory:', error)
    return null
  }

  return data
}

// Get all media for a memory
export async function getMemoryMedia(memoryId: string): Promise<MemoryMedia[]> {
  const { data, error } = await supabase
    .from('memory_media')
    .select('*')
    .eq('memory_id', memoryId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching memory media:', error)
    return []
  }

  return data || []
}

// Get all memories (for admin dashboard)
export async function getAllMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching memories:', error)
    return []
  }

  return data || []
}

// Create a new memory
export async function createMemory(data: {
  id: string
  title: string
  description: string
  memory_date?: string | null
  cover_image_url?: string | null
  keychain_image_url?: string | null
}): Promise<Memory | null> {
  const { data: memory, error } = await supabase
    .from('memories')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Error creating memory:', error)
    return null
  }

  return memory
}

// Update a memory
export async function updateMemory(
  id: string,
  data: {
    title?: string
    description?: string
    memory_date?: string | null
    cover_image_url?: string | null
    keychain_image_url?: string | null
  }
): Promise<Memory | null> {
  const { data: memory, error } = await supabase
    .from('memories')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating memory:', error)
    return null
  }

  return memory
}

// Upload media file to Supabase storage
export async function uploadMedia(
  memoryId: string,
  file: File
): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${memoryId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('memories')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading file:', error)
    return null
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('memories').getPublicUrl(data.path)

  // Determine media type
  const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

  // Insert into memory_media table
  const { error: insertError } = await supabase
    .from('memory_media')
    .insert([
      {
        memory_id: memoryId,
        media_url: publicUrl,
        media_type: mediaType,
      },
    ])

  if (insertError) {
    console.error('Error inserting media record:', insertError)
    // Try to delete the uploaded file
    await supabase.storage.from('memories').remove([filePath])
    return null
  }

  return publicUrl
}

// Delete media file
export async function deleteMedia(mediaId: string): Promise<boolean> {
  // First get the media record to find the file path
  const { data: media, error: fetchError } = await supabase
    .from('memory_media')
    .select('*')
    .eq('id', mediaId)
    .single()

  if (fetchError || !media) {
    console.error('Error fetching media record:', fetchError)
    return false
  }

  // Extract file path from URL
  // Supabase storage URLs format: https://[project].supabase.co/storage/v1/object/public/memories/[path]
  try {
    const url = new URL(media.media_url)
    const pathParts = url.pathname.split('/')
    const memoriesIndex = pathParts.indexOf('memories')
    
    if (memoriesIndex === -1) {
      console.error('Could not extract file path from URL')
    } else {
      const filePath = pathParts.slice(memoriesIndex + 1).join('/')
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('memories')
        .remove([filePath])

      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }
  } catch (err) {
    console.error('Error parsing URL:', err)
    // Continue with database deletion even if URL parsing fails
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('memory_media')
    .delete()
    .eq('id', mediaId)

  if (deleteError) {
    console.error('Error deleting media record:', deleteError)
    return false
  }

  return true
}

