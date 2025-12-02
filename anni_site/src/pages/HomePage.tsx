import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllMemories, Memory } from '../lib/database'

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMemories() {
      try {
        const data = await getAllMemories()
        setMemories(data)
      } catch (err) {
        console.error('Failed to load memories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMemories()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/bg-jpn.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/20"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-8 py-12">
        <div className="max-w-2xl w-full text-center animate-fade-in-slow">
          {/* Title Section */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-rose-400/90 mb-4 tracking-wider leading-tight font-light">
              Gacha Memories
            </h1>
            <p className="font-sans text-rose-300/70 text-sm md:text-base tracking-[0.2em] uppercase font-normal mt-4">
              Choose a Memory
            </p>
            <div className="w-24 h-px bg-rose-300/40 mx-auto mt-6"></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-rose-300/70 font-sans text-sm tracking-widest uppercase font-normal">
              Loading...
            </div>
          )}

          {/* Memories List */}
          {!loading && memories.length > 0 && (
            <div className="space-y-4 mt-12">
              {memories.map((memory, index) => (
                <Link
                  key={memory.id}
                  to={`/memory/${memory.id}`}
                  className="block group animate-fade-in-slow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    {/* Soft Glow on Hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-200/20 to-amber-200/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm"></div>
                    
                    {/* Button Container */}
                    <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-sm px-8 py-6 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:border-rose-200/50 shadow-soft">
                      <h2 className="font-serif text-xl md:text-2xl text-rose-400/90 tracking-wide font-light mb-2">
                        {memory.title}
                      </h2>
                      {(memory.memory_date || memory.created_at) && (
                        <p className="font-sans text-rose-300/70 text-xs tracking-widest uppercase font-normal">
                          {new Date(memory.memory_date || memory.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {memory.description && (
                        <p className="font-sans text-rose-400/80 text-sm mt-3 tracking-wide font-normal">
                          {memory.description.length > 120 
                            ? `${memory.description.substring(0, 120)}...` 
                            : memory.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && memories.length === 0 && (
            <div className="mt-12 animate-fade-in-slow">
              <p className="font-sans text-rose-300/70 text-sm tracking-widest uppercase font-normal">
                No memories yet
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-16">
            <p className="font-sans text-rose-300/60 text-xs tracking-[0.2em] uppercase font-normal">
              Scan a QR code or select a memory above
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
