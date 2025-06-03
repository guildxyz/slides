import { useState, useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from './loading.json'

const LoadingIcon = () => {
  const [shouldPlay, setShouldPlay] = useState(true)
  const lottieRef = useRef()
  const intervalRef = useRef()

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleComplete = () => {
    setShouldPlay(false)
    
    intervalRef.current = setTimeout(() => {
      setShouldPlay(true)
      if (lottieRef.current) {
        lottieRef.current.goToAndPlay(0)
      }
    }, 30000)
  }

  return (
    <div className="loading-icon">
      <Lottie 
        lottieRef={lottieRef}
        animationData={loadingAnimation}
        loop={false}
        autoplay={shouldPlay}
        onComplete={handleComplete}
        style={{ width: 80, height: 80 }}
      />
    </div>
  )
}

export default LoadingIcon 