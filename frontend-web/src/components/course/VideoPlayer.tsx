"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
}

export function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(Number(e.target.value))
    }
  }

  return (
    <div className={cn("relative group bg-black rounded-xl overflow-hidden aspect-video shadow-2xl border-4 border-muted/20", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />
      
      {/* Overlay Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary mb-4"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlay}>
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <SkipBack className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <SkipForward className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsMuted(!isMuted)}>
                 {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
               </Button>
               <input
                 type="range"
                 min="0"
                 max="1"
                 step="0.1"
                 value={isMuted ? 0 : volume}
                 onChange={(e) => setVolume(Number(e.target.value))}
                 className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
               />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
               <Settings className="size-5" />
             </Button>
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
               <Maximize className="size-5" />
             </Button>
          </div>
        </div>
      </div>

      {/* Big Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-primary/90 rounded-full p-6 text-white shadow-2xl ring-8 ring-primary/20 animate-pulse">
            <Play className="size-10 fill-current" />
          </div>
        </div>
      )}
    </div>
  )
}
