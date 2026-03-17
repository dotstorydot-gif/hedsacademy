"use client"

import { useState, useRef } from 'react'
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
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
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
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
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
    <div className={cn("relative group bg-black rounded-[2rem] overflow-hidden aspect-video shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border-8 border-white/5", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />
      
      {/* Overlay Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
        {/* Progress Bar */}
        <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden group/bar">
           <div 
             className="absolute h-full bg-brand-yellow shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all duration-100 ease-out" 
             style={{ width: `${progress}%` }} 
           />
           <input
             type="range"
             min="0"
             max="100"
             value={progress}
             onChange={handleSeek}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
           />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="size-12 text-white hover:bg-white/10 rounded-xl transition-all active:scale-90" onClick={togglePlay}>
              {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}
            </Button>
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="icon" className="size-10 text-white/60 hover:text-white transition-all">
                 <SkipBack className="size-5" />
               </Button>
               <Button variant="ghost" size="icon" className="size-10 text-white/60 hover:text-white transition-all">
                 <SkipForward className="size-5" />
               </Button>
            </div>
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-4 group/volume">
               <Button variant="ghost" size="icon" className="text-white/60 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
                 {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
               </Button>
               <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-brand-yellow"
                  />
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mr-4 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
             </div>
             <Button variant="ghost" size="icon" className="text-white/40 hover:text-white transition-colors">
               <Settings className="size-5" />
             </Button>
             <Button variant="ghost" size="icon" className="text-white/40 hover:text-white transition-colors">
               <Maximize className="size-5" />
             </Button>
          </div>
        </div>
      </div>

      {/* Big Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
          <div className="bg-brand-yellow rounded-[2rem] p-8 text-black shadow-[0_20px_50px_rgba(255,215,0,0.3)] ring-12 ring-brand-yellow/10">
            <Play className="size-12 fill-current" />
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "00:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
