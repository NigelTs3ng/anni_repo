import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { getAllMemories, Memory } from '../lib/database'

export default function AdminDashboard() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    setLoading(true)
    const data = await getAllMemories()
    setMemories(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pink-700 flex items-center">
              <span className="mr-3">💕</span> Admin Dashboard
            </h1>
            <p className="text-pink-600 mt-1">Manage your memories</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Create Button */}
        <Link
          to="/admin/memory/create"
          className="block w-full mb-6 bg-pink-500 text-white text-center py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors shadow-lg"
        >
          + Create New Memory
        </Link>

        {/* Memories List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-pulse">💕</div>
            <div className="text-pink-600 font-semibold">Loading...</div>
          </div>
        ) : memories.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
            <div className="text-5xl mb-4">💝</div>
            <p className="text-pink-600 text-lg mb-4">No memories yet</p>
            <Link
              to="/admin/memory/create"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              Create Your First Memory
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {memories.map((memory) => (
              <Link
                key={memory.id}
                to={`/admin/memory/${memory.id}`}
                className="block bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-pink-700 mb-2">
                      {memory.title}
                    </h2>
                    <p className="text-pink-600 text-sm mb-2 line-clamp-2">
                      {memory.description || 'No description'}
                    </p>
                    <p className="text-pink-400 text-xs">
                      ID: {memory.id} •{' '}
                      {new Date(memory.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 text-2xl">💕</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


