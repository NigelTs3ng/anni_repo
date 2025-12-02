import { useRef, useState } from 'react'

interface PhotoCarouselProps {
  images: Array<{ id: string; media_url: string }>
  onImageClick: (url: string) => void
  memoryTitle: string
}

export default function PhotoCarousel({ images, onImageClick, memoryTitle }: PhotoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth py-2"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => (
          <div
            key={img.id}
            className="flex-shrink-0 snap-center group cursor-pointer"
            onClick={() => !isDragging && onImageClick(img.media_url)}
          >
            <div className="relative">
              {/* Soft Glow */}
              <div className="absolute -inset-2 bg-gradient-to-br from-rose-200/20 to-amber-200/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Image Container */}
              <div className="relative w-[280px] md:w-[380px] aspect-[4/3] overflow-hidden border border-rose-200/40 shadow-cinematic transform transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={img.media_url}
                  alt={`${memoryTitle} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                {/* Film Border */}
                <div className="absolute inset-0 border-4 border-white/15 pointer-events-none"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {images.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-rose-300/40"
            />
          ))}
        </div>
      )}
    </div>
  )
}

