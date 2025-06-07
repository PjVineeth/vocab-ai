"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Linkedin, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { teamMembers, TeamMember } from "@/app/data/teamMembers"

export default function TeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    if (isHovered || selectedMember) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1))
    }, 2000)

    return () => clearInterval(interval)
  }, [isHovered, selectedMember])

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleMemberClick = (index: number) => {
    if (isAnimating) return
    setActiveIndex(index)
    setSelectedMember(teamMembers[index])
  }

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex

    if (diff === 0) return "center"
    if (diff === 1 || diff === -teamMembers.length + 1) return "right-1"
    if (diff === -1 || diff === teamMembers.length - 1) return "left-1"
    if (diff === 2 || diff === -teamMembers.length + 2) return "right-2"
    if (diff === -2 || diff === teamMembers.length - 2) return "left-2"
    return "hidden"
  }

  // Explicit hover handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      <div 
        className="relative w-full h-[350px] sm:h-[500px] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={cn(
                "absolute transition-all duration-200 ease-in-out rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:z-30",
                getCardPosition(index) === "center" && "z-20 scale-100 translate-x-0 border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "left-1" && "z-10 scale-95 -translate-x-[70%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "right-1" && "z-10 scale-95 translate-x-[70%] border-2 border-white mx-1 sm:mx-4",
                // getCardPosition(index) === "left-2" && "z-0 scale-90 -translate-x-[120%] border-2 border-white mx-1 sm:mx-4",
                // getCardPosition(index) === "right-2" && "z-0 scale-90 translate-x-[120%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "hidden" && "opacity-0 scale-50",
              )}
              onClick={() => handleMemberClick(index)}
            >
              <div className="relative w-[220px] h-[300px] sm:w-[300px] sm:h-[400px] bg-black group">
                <Image
                  src={member.image}
                  alt={member.name}
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
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-200">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-48 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous member"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 md:right-48 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Next member"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={() => {
          setSelectedMember(null);
          setIsAnimating(false);
        }} />
      )}
    </div>
  )
}

function TeamMemberModal({ member, onClose }: { member: TeamMember, onClose: () => void }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-3 sm:p-5 max-w-xs sm:max-w-sm w-full relative flex flex-col items-center overflow-visible">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-black z-50 transition-all"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
        <img src={member.image} alt={member.name} className="w-20 h-20 object-cover rounded-full mx-auto mb-2 border-4 border-white shadow" />
        <div className="flex space-x-4 mb-2 justify-center">
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-900">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-800 hover:text-black">
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
        <h2 className="text-lg font-bold text-center mb-1">{member.name}</h2>
        <p className="text-sm text-gray-600 text-center mb-2">{member.role}</p>
        <p className="mb-1 text-md text-center"><b>Experience: </b>{member.bio}</p>
      </div>
    </div>
  );
} 