"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { galleryImages, GalleryImage } from "@/app/data/galleryImages"

export default function GalleryCarousel() {
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      if (!isAnimating) {
        setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isHovered, isAnimating, galleryImages.length])

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleImageClick = (index: number) => {
    if (isAnimating || index === activeIndex) return
    setIsAnimating(true)
    setActiveIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex

    if (diff === 0) return "center"
    if (diff === 1 || diff === -galleryImages.length + 1) return "right-1"
    if (diff === -1 || diff === galleryImages.length - 1) return "left-1"
    if (diff === 2 || diff === -galleryImages.length + 2) return "right-2"
    if (diff === -2 || diff === galleryImages.length - 2) return "left-2"
    return "hidden"
  }

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      <div 
        className="relative w-full h-[350px] sm:h-[500px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "absolute transition-all duration-200 ease-in-out rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:z-30",
                getCardPosition(index) === "center" && "z-20 scale-100 translate-x-0 border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "left-1" && "z-10 scale-95 -translate-x-[70%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "right-1" && "z-10 scale-95 translate-x-[70%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "left-2" && "z-0 scale-90 -translate-x-[120%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "right-2" && "z-0 scale-90 translate-x-[120%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "hidden" && "opacity-0 scale-50",
              )}
              onClick={() => handleImageClick(index)}
            >
              <div className="relative w-[220px] h-[300px] sm:w-[300px] sm:h-[400px] bg-black group">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index === activeIndex}
                />
                {getCardPosition(index) !== "center" && (
                  <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
                )}
                <div className={cn(
                  "absolute inset-0 flex flex-col justify-end p-2 sm:p-6 text-white bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300",
                  getCardPosition(index) === "center" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <h2 className="text-2xl font-bold mb-1">{image.alt}</h2>
                  {/* <button className="bg-white text-black text-xs py-1 px-4 rounded-full w-fit hover:bg-gray-200 transition-colors">
                    VIEW MORE
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
} 