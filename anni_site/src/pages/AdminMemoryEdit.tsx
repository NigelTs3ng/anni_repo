import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMemory, getMemoryMedia, updateMemory, uploadMedia, deleteMedia, Memory, MemoryMedia } from '../lib/database'

export default function AdminMemoryEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [media, setMedia] = useState<MemoryMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    memory_date: '',
  })
  const [keychainImage, setKeychainImage] = useState<File | null>(null)

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [memoryData, mediaData] = await Promise.all([
        getMemory(id),
        getMemoryMedia(id),
      ])
      if (memoryData) {
        setMemory(memoryData)
        // Format date for input field (YYYY-MM-DD)
        const dateValue = memoryData.memory_date 
          ? new Date(memoryData.memory_date).toISOString().split('T')[0]
          : memoryData.created_at 
            ? new Date(memoryData.created_at).toISOString().split('T')[0]
            : ''
        setFormData({
          title: memoryData.title,
          description: memoryData.description || '',
          memory_date: dateValue,
        })
        setMedia(mediaData)
      } else {
        setError('Memory not found')
      }
    } catch (err) {
      setError('Failed to load memory')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)

    try {
      // Upload keychain image if provided
      let keychainImageUrl: string | null = memory?.keychain_image_url || null
      if (keychainImage) {
        const url = await uploadMedia(id, keychainImage)
        if (url) {
          keychainImageUrl = url
        }
      }

      const updated = await updateMemory(id, {
        ...formData,
        keychain_image_url: keychainImageUrl,
      })
      if (updated) {
        setMemory(updated)
        setKeychainImage(null)
        alert('Memory updated successfully! 💕')
      } else {
        setError('Failed to update memory')
      }
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    setUploading(true)
    setError(null)

    try {
      const url = await uploadMedia(id, file)
      if (url) {
        await fetchData() // Refresh media list
        alert('Media uploaded successfully! 💕')
      } else {
        setError('Failed to upload media')
      }
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const success = await deleteMedia(mediaId)
      if (success) {
        await fetchData() // Refresh media list
        alert('Media deleted successfully! 💕')
      } else {
        setError('Failed to delete media')
      }
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">💕</div>
          <div className="text-pink-600 font-semibold">Loading...</div>
        </div>
      </div>
    )
  }

  if (error && !memory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">💔</div>
          <h1 className="text-2xl font-bold text-pink-600 mb-4">{error}</h1>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!memory) return null

  const images = media.filter((m) => m.media_type === 'image')
  const videos = media.filter((m) => m.media_type === 'video')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-700 flex items-center mb-2">
            <span className="mr-3">💕</span> Edit Memory
          </h1>
          <div className="flex gap-4">
            <a
              href="/admin"
              className="text-pink-600 hover:text-pink-700 text-sm"
            >
              ← Back to Dashboard
            </a>
            <a
              href={`/memory/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 text-sm"
            >
              View Public Page →
            </a>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Memory Details</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Memory ID
              </label>
              <input
                type="text"
                value={memory.id}
                disabled
                className="w-full px-4 py-3 border border-pink-300 rounded-xl bg-pink-50 text-pink-600"
              />
              <p className="text-xs text-pink-500 mt-1">ID cannot be changed</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-pink-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="memory_date" className="block text-sm font-medium text-pink-700 mb-2">
                Memory Date
              </label>
              <input
                id="memory_date"
                type="date"
                value={formData.memory_date}
                onChange={(e) => setFormData({ ...formData, memory_date: e.target.value })}
                className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-pink-500 mt-1">The date displayed on the memory page</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-pink-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label htmlFor="keychainImage" className="block text-sm font-medium text-pink-700 mb-2">
                Keychain Image (Portrait)
              </label>
              {memory.keychain_image_url && (
                <div className="mb-3">
                  <p className="text-xs text-pink-600 mb-2">Current keychain image:</p>
                  <img
                    src={memory.keychain_image_url}
                    alt="Current keychain"
                    className="max-w-[200px] h-auto border border-pink-200 rounded-lg"
                  />
                </div>
              )}
              <input
                id="keychainImage"
                type="file"
                accept="image/*"
                onChange={(e) => setKeychainImage(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-pink-500 mt-1">Upload a portrait image of the keychain (will be displayed below description)</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Upload Media */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Upload Media</h2>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
          />
          {uploading && (
            <p className="text-pink-600 text-sm mt-2">Uploading... 💕</p>
          )}
        </div>

        {/* Existing Media */}
        {images.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-pink-700 mb-4 flex items-center">
              <span className="mr-2">📸</span> Photos ({images.length})
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.media_url}
                    alt="Memory media"
                    className="w-full aspect-square object-cover rounded-xl shadow-md"
                  />
                  <button
                    onClick={() => handleDeleteMedia(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-pink-700 mb-4 flex items-center">
              <span className="mr-2">🎥</span> Videos ({videos.length})
            </h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="relative group">
                  <video
                    src={video.media_url}
                    controls
                    className="w-full rounded-xl shadow-md"
                  />
                  <button
                    onClick={() => handleDeleteMedia(video.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && videos.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">💝</div>
            <p className="text-pink-600">No media uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}


