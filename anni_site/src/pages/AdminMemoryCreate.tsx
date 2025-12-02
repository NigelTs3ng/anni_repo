import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMemory, uploadMedia } from '../lib/database'

export default function AdminMemoryCreate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    memory_date: '',
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Upload cover image if provided
      let coverImageUrl: string | null = null
      if (coverImage) {
        const url = await uploadMedia(formData.id, coverImage)
        if (url) {
          coverImageUrl = url
        }
      }

      // Create memory
      const memory = await createMemory({
        ...formData,
        memory_date: formData.memory_date || null,
        cover_image_url: coverImageUrl,
      })

      if (!memory) {
        setError('Failed to create memory')
        setLoading(false)
        return
      }

      navigate(`/admin/memory/${memory.id}`)
    } catch (err) {
      setError('An error occurred')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-700 flex items-center mb-2">
            <span className="mr-3">💕</span> Create New Memory
          </h1>
          <a
            href="/admin"
            className="text-pink-600 hover:text-pink-700 text-sm"
          >
            ← Back to Dashboard
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-6"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="id" className="block text-sm font-medium text-pink-700 mb-2">
              Memory ID <span className="text-red-500">*</span>
            </label>
            <input
              id="id"
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., 001, first-date, etc."
            />
            <p className="text-xs text-pink-500 mt-1">
              This will be used in the URL: /memory/{formData.id || '...'}
            </p>
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
              placeholder="Memory title"
            />
          </div>

          <div>
            <label htmlFor="memory_date" className="block text-sm font-medium text-pink-700 mb-2">
              Memory Date (Optional)
            </label>
            <input
              id="memory_date"
              type="date"
              value={formData.memory_date}
              onChange={(e) => setFormData({ ...formData, memory_date: e.target.value })}
              className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="text-xs text-pink-500 mt-1">Leave empty to use today's date</p>
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
              placeholder="Write about this memory..."
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-pink-700 mb-2">
              Cover Image (Optional)
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Memory'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border border-pink-300 text-pink-700 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


