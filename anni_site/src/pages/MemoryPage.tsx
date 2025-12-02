import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMemory, getMemoryMedia, Memory, MemoryMedia } from '../lib/database'
import PhotoCarousel from '../components/PhotoCarousel'

export default function MemoryPage() {
  const { id } = useParams<{ id: string }>()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [media, setMedia] = useState<MemoryMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid memory ID')
      setLoading(false)
      return
    }

    async function fetchData() {
      if (!id) return
      try {
        const [memoryData, mediaData] = await Promise.all([
          getMemory(id),
          getMemoryMedia(id),
        ])

        if (!memoryData) {
          setError('Memory not found')
        } else {
          setMemory(memoryData)
          setMedia(mediaData)
        }
      } catch (err) {
        setError('Failed to load memory')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0">
          <img
            src="/bg-jpn.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/20"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-rose-300 font-serif text-2xl tracking-widest animate-fade-in-slow">
              Loading...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !memory) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0">
          <img
            src="/bg-jpn.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/20"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-rose-400 mb-6 tracking-wide">
              {error || 'Memory not found'}
            </h1>
            <Link
              to="/"
              className="inline-block text-rose-400 hover:text-rose-500 font-normal text-sm tracking-widest uppercase transition-colors duration-500"
            >
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = media.filter((m) => m.media_type === 'image')
  const videos = media.filter((m) => m.media_type === 'video')

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
      <div className="relative z-10">
        {/* Minimal Back Button */}
        <div className="fixed top-6 left-6 z-30">
          <Link
            to="/"
            className="text-rose-400/70 hover:text-rose-500 transition-colors duration-500 group"
          >
            <svg
              className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>

        {/* Header Section - K-drama Style */}
        <div className="pt-20 pb-16 px-6 md:px-8 text-center animate-fade-in-slow">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-rose-400/90 mb-4 tracking-wider leading-tight font-light">
            {memory.title}
          </h1>
          {(memory.memory_date || memory.created_at) && (
            <p className="font-sans text-rose-300/80 text-xs md:text-sm tracking-[0.2em] uppercase font-normal mt-4">
              {new Date(memory.memory_date || memory.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* Description - Elegant Header Style */}
        {memory.description && (
          <div className="px-6 md:px-8 mb-20 animate-fade-in-slow delay-300">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-rose-400/90 leading-relaxed tracking-wide font-light whitespace-pre-wrap">
                {memory.description}
              </p>
            </div>
          </div>
        )}

        {/* Cover Image - Cinematic */}
        {memory.cover_image_url && (
          <div className="px-6 md:px-8 mb-20 animate-fade-in-slow delay-500">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Soft Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-200/30 to-amber-200/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Image with Film Border */}
                <div className="relative overflow-hidden border border-rose-200/40 shadow-cinematic">
                  <img
                    src={memory.cover_image_url}
                    alt={memory.title}
                    className="w-full h-auto object-cover"
                    loading="eager"
                  />
                  {/* Film Border Effect */}
                  <div className="absolute inset-0 border-8 border-white/20 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photos Section - Two Carousels */}
        {images.length > 0 && (
          <div className="px-6 md:px-8 mb-20 animate-fade-in-slow delay-700">
            <div className="max-w-7xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl md:text-3xl text-rose-400/90 tracking-widest font-light mb-2">
                  Moments
                </h2>
                <div className="w-16 h-px bg-rose-300/50 mx-auto"></div>
              </div>

              {/* Split images into two carousels */}
              {(() => {
                const midPoint = Math.ceil(images.length / 2)
                const topCarousel = images.slice(0, midPoint)
                const bottomCarousel = images.slice(midPoint)

                return (
                  <div className="space-y-12">
                    {/* Top Carousel */}
                    {topCarousel.length > 0 && (
                      <div className="animate-fade-in-slow">
                        <PhotoCarousel
                          images={topCarousel}
                          onImageClick={setSelectedImage}
                          memoryTitle={memory.title}
                        />
                      </div>
                    )}

                    {/* Bottom Carousel */}
                    {bottomCarousel.length > 0 && (
                      <div className="animate-fade-in-slow delay-300">
                        <PhotoCarousel
                          images={bottomCarousel}
                          onImageClick={setSelectedImage}
                          memoryTitle={memory.title}
                        />
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* Videos Section - Cinematic */}
        {videos.length > 0 && (
          <div className="px-6 md:px-8 mb-20 animate-fade-in-slow delay-900">
            <div className="max-w-4xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl md:text-3xl text-rose-400/80 tracking-widest font-light mb-2">
                  Memories
                </h2>
                <div className="w-16 h-px bg-rose-300/40 mx-auto"></div>
              </div>

              <div className="space-y-12">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="relative group animate-fade-in-slow"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Soft Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-rose-200/20 to-amber-200/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    {/* Video Container */}
                    <div className="relative overflow-hidden border border-rose-200/30 shadow-cinematic">
                      <video
                        src={video.media_url}
                        controls
                        className="w-full"
                        playsInline
                      >
                        Your browser does not support the video tag.
                      </video>
                      {/* Film Border */}
                      <div className="absolute inset-0 border-4 border-white/15 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && videos.length === 0 && !memory.cover_image_url && (
          <div className="px-6 md:px-8 py-20 text-center animate-fade-in-slow">
            <p className="font-sans text-rose-300/70 text-sm tracking-widest uppercase font-normal">
              No media yet
            </p>
          </div>
        )}

        {/* Footer Spacing */}
        <div className="h-24"></div>
      </div>

      {/* Cinematic Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-slow"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors duration-500 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image with Soft Glow */}
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <div className="absolute -inset-8 bg-white/10 blur-3xl"></div>
            <img
              src={selectedImage}
              alt="Full size"
              className="relative w-full h-auto max-h-[90vh] object-contain border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
