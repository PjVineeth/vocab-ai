"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSize?: string;
}

export default function ProfileImage({ 
  src, 
  alt, 
  className, 
  fallbackSize = "w-8 h-8" 
}: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Reset error state when src changes
  useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoading(true);
      setRetryCount(0);
    }
  }, [src]);

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      // Retry loading the image after a brief delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageLoading(true);
      }, 1000);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  if (!src || imageError) {
    return (
      <div className={`${className} bg-white flex items-center justify-center`}>
        <User className={`${fallbackSize} text-blue-600`} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={`${src}${retryCount > 0 ? `?retry=${retryCount}` : ''}`}
        alt={alt}
        fill
        className="object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        sizes="40px"
        unoptimized={src.includes('googleapis.com')} // Disable optimization for Google images
      />
      {imageLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <User className={`${fallbackSize} text-blue-600`} />
        </div>
      )}
    </div>
  );
} 