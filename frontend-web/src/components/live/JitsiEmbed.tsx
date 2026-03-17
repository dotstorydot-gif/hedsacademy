"use client"

import { useEffect, useRef } from 'react'

interface JitsiEmbedProps {
  roomName: string
  userName: string
  onLeave?: () => void
}

export function JitsiEmbed({ roomName, userName, onLeave }: JitsiEmbedProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const domain = 'meet.jit.si'
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: userName
      },
      configOverwrite: {
        startWithAudioMuted: true,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ],
      }
    }

    // Load Jitsi API script if not already loaded
    if (!(window as any).JitsiMeetExternalAPI) {
       const script = document.createElement('script')
       script.src = `https://${domain}/external_api.js`
       script.async = true
       script.onload = () => {
         const api = new (window as any).JitsiMeetExternalAPI(domain, options)
         api.addEventListener('videoConferenceLeft', onLeave || (() => {}))
       }
       document.body.appendChild(script)
    } else {
       const api = new (window as any).JitsiMeetExternalAPI(domain, options)
       api.addEventListener('videoConferenceLeft', onLeave || (() => {}))
    }

    return () => {
       // Cleanup if needed (the container will be cleared by React)
    }
  }, [roomName, userName, onLeave])

  return (
    <div className="w-full h-full min-h-[600px] rounded-2xl overflow-hidden border-4 border-muted shadow-2xl bg-black" ref={jitsiContainerRef} />
  )
}
