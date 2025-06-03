import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

const SLIDES_DATA = [
  {
    id: 'intro',
    type: 'title',
    title: "Building Crypto Communities Online",
    subtitle: "From Zero to Thriving Ecosystem",
    author: "Raz, Founder at Guild.xyz",
    metadata: { duration: '30 min', date: 'March 6, 2025', event: 'Mantle x Hackquest' }
  },
  {
    id: 'purpose',
    type: 'content',
    title: "Start with Purpose",
    subtitle: "Community > Technology",
    content: [
      { 
        text: "Define your mission clearly", 
        example: "Clear, actionable, memorable."
      },
      { 
        text: "Solve real problems", 
        example: "Create genuine utility before speculation."
      },
      {
        text: "Start strong",
        example: "Start with the most high-profile people in your network."
      },
      { 
        text: "Build around shared values, not just tokens", 
        example: "Philosophy creates lasting communities."
      },
    ]
  },
  {
    id: 'engagement',
    type: 'content',
    title: "Design for Engagement",
    subtitle: "Tools & Structure That Work",
    content: [
      { 
        text: "Use token-gated access for exclusivity", 
        example: "Bored Apes holders get exclusive Discord access. Creates FOMO and belonging."
      },
      { 
        text: "Create clear progression paths", 
        example: "Start as lurker → contributor → core team → governance voter. Make the journey visible."
      },
      { 
        text: "Reward meaningful contributions", 
        example: "POAPs for events, tokens for code commits, NFTs for creative work. Match rewards to actions."
      },
      {
        text: "Try everything yourself",
        example: "Don't trust ideas blindly, try the end user experiences yourself."
      },
      { 
        text: "Build multi-platform presence", 
        example: "Discord for chat, Twitter for updates, GitHub for code, Paragraph for long-form content."
      }
    ]
  },
  {
    id: 'governance',
    type: 'content',
    title: "Governance & Ownership",
    subtitle: "Give Power to the People",
    content: [
      { 
        text: "Progressive decentralization", 
        example: "Start with 5-person core team, gradually add community governors over 2-3 years."
      },
      { 
        text: "Start with clear leadership, transition gradually", 
        example: "Vitalik led Ethereum early, now foundation shares power. Leadership evolution, not abandonment."
      },
      { 
        text: "Use DAOs for major decisions", 
        example: "Treasury spending >$10K, protocol upgrades, partnership approvals. Big decisions = community decisions."
      },
      { 
        text: "Create transparent voting mechanisms", 
        example: "Onchain execution, public proposal discussions. Transparency builds trust."
      }
    ]
  },
  {
    id: 'scaling',
    type: 'content',
    title: "Scale & Sustain",
    subtitle: "Long-term Community Health",
    content: [
      { 
        text: "Focus on retention over acquisition", 
        example: "10 engaged daily users > 1000 one-time visitors. Quality relationships compound over time."
      },
      { 
        text: "Maintain culture as you grow", 
        example: "Document core values, onboard new members carefully, celebrate cultural wins publicly."
      }
    ]
  }
]

const useKeyboardNavigation = (currentSlide, totalSlides, onSlideChange) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          event.preventDefault()
          onSlideChange(Math.min(currentSlide + 1, totalSlides - 1))
          break
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault()
          onSlideChange(Math.max(currentSlide - 1, 0))
          break
        case 'Home':
          event.preventDefault()
          onSlideChange(0)
          break
        case 'End':
          event.preventDefault()
          onSlideChange(totalSlides - 1)
          break
        case 'Escape':
          event.preventDefault()
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
          break
        case 'f':
        case 'F11':
          if (event.key === 'f') {
            event.preventDefault()
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen()
            } else {
              document.exitFullscreen()
            }
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide, totalSlides, onSlideChange])
}

const useSlideTimer = (isActive = false) => {
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  return timeSpent
}

const TitleSlide = ({ slide }) => (
  <div className="title-slide" role="main" aria-labelledby="main-title">
    <h1 id="main-title">{slide.title}</h1>
    <h2>{slide.subtitle}</h2>
    <p className="author">{slide.author}</p>
    <div className="metadata">
      <span>{slide.metadata.event}</span>
      <span>{slide.metadata.date}</span>
      <span>{slide.metadata.duration}</span>
    </div>
  </div>
)

const ContentSlide = ({ slide }) => (
  <div className="content-slide" role="main" aria-labelledby={`slide-title-${slide.id}`}>
    <header>
      <h1 id={`slide-title-${slide.id}`}>{slide.title}</h1>
      <h2>{slide.subtitle}</h2>
    </header>
    <ul className="slide-content" role="list">
      {slide.content.map((item, index) => (
        <li key={index} role="listitem">
          <div className="content-text">{item.text}</div>
          {item.example && (
            <div className="content-example">{item.example}</div>
          )}
        </li>
      ))}
    </ul>
  </div>
)

const SlideIndicators = ({ slides, currentSlide, onSlideChange }) => (
  <div className="slide-indicators" role="tablist" aria-label="Slide navigation">
    {slides.map((slide, index) => (
      <button
        key={slide.id}
        role="tab"
        aria-selected={index === currentSlide}
        aria-label={`Go to slide ${index + 1}: ${slide.title}`}
        className={`indicator ${index === currentSlide ? 'active' : ''}`}
        onClick={() => onSlideChange(index)}
        tabIndex={index === currentSlide ? 0 : -1}
      >
        {index + 1}
      </button>
    ))}
  </div>
)

const NavigationControls = ({ currentSlide, totalSlides, onSlideChange }) => {
  const canGoPrevious = currentSlide > 0
  const canGoNext = currentSlide < totalSlides - 1

  return (
    <nav className="navigation" role="navigation" aria-label="Presentation navigation">
      <button
        onClick={() => onSlideChange(currentSlide - 1)}
        disabled={!canGoPrevious}
        aria-label="Previous slide"
        className="nav-button prev"
      >
        ← Previous
      </button>

      <SlideIndicators 
        slides={SLIDES_DATA} 
        currentSlide={currentSlide} 
        onSlideChange={onSlideChange} 
      />

      <button
        onClick={() => onSlideChange(currentSlide + 1)}
        disabled={!canGoNext}
        aria-label="Next slide"
        className="nav-button next"
      >
        Next →
      </button>
    </nav>
  )
}

const PresentationControls = ({ currentSlide, totalSlides, timeSpent }) => {
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  return (
    <div className="controls" role="complementary" aria-label="Presentation controls">
      <div className="controls-row">
                Time: {formatTime(timeSpent)}

        <button 
          onClick={toggleFullscreen}
          className="control-button"
          aria-label="Toggle fullscreen"
        >
          ⛶ Fullscreen
        </button>
      </div>
    </div>
  )
}

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)
  
  const slides = useMemo(() => SLIDES_DATA, [])
  const totalSlides = slides.length
  const timeSpent = useSlideTimer(isPresenting)

  const handleSlideChange = useCallback((newSlide) => {
    if (newSlide >= 0 && newSlide < totalSlides) {
      setCurrentSlide(newSlide)
      if (!isPresenting) setIsPresenting(true)
    }
  }, [totalSlides, isPresenting])

  useKeyboardNavigation(currentSlide, totalSlides, handleSlideChange)

  const currentSlideData = slides[currentSlide]

  useEffect(() => {
    document.title = `${currentSlideData.title} - Building Crypto Communities Online`
  }, [currentSlideData.title])

  return (
    <div 
      className="presentation" 
      role="application"
      aria-label="Building Crypto Communities Online Presentation"
      tabIndex={0}
    >
      <main className="slide" key={currentSlideData.id}>
        {currentSlideData.type === 'title' ? (
          <TitleSlide slide={currentSlideData} />
        ) : (
          <ContentSlide slide={currentSlideData} />
        )}
      </main>

      <NavigationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onSlideChange={handleSlideChange}
      />

      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        timeSpent={timeSpent}
      />
    </div>
  )
}

export default App
