import { useRef, useEffect, useState, useCallback } from 'react'
import './App.css'

const STATUS = {
  IDLE: 'idle',
  LOOKING: 'looking',
  SPEAKING: 'speaking',
  ERROR: 'error',
}

const STATUS_LABEL = {
  [STATUS.IDLE]: 'Tap anywhere to look',
  [STATUS.LOOKING]: 'Looking…',
  [STATUS.SPEAKING]: 'Speaking…',
  [STATUS.ERROR]: 'Something went wrong. Tap to try again.',
}

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState(STATUS.IDLE)
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    let stream
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((s) => {
        stream = s
        videoRef.current.srcObject = s
        setCameraReady(true)
      })
      .catch(() => setStatus(STATUS.ERROR))
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [])

  const speak = useCallback((text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.onend = () => setStatus(STATUS.IDLE)
    utterance.onerror = () => setStatus(STATUS.IDLE)
    window.speechSynthesis.speak(utterance)
  }, [])

  const handleTap = useCallback(async () => {
    if (status !== STATUS.IDLE || !cameraReady) return

    navigator.vibrate?.(80)
    setStatus(STATUS.LOOKING)
    speak('Looking…')

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]

    try {
      const res = await fetch('/api/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      })
      const data = await res.json()
      setStatus(STATUS.SPEAKING)
      speak(data.description || 'Could not get a description. Please try again.')
    } catch {
      setStatus(STATUS.SPEAKING)
      speak('Network error. Please try again.')
    }
  }, [status, cameraReady, speak])

  return (
    <div className="app" onClick={handleTap} role="button" aria-label="Tap to describe scene">
      <video ref={videoRef} autoPlay playsInline muted className="camera" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className={`overlay status-${status}`}>
        <p className="status-text">{STATUS_LABEL[status]}</p>
      </div>
    </div>
  )
}
