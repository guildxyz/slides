import { useState, useEffect } from 'react'
import ShaderBackground from './ShaderBackground'
import './App.css'

const slides = [
  {
    id: 0,
    title: "What Makes Ethereum Truly Powerful",
    subtitle: "Back to the Basics",
    content: "Let's revisit the core principles that make Ethereum the foundation for a new financial and digital ecosystem.",
    type: "title"
  },
  {
    id: 1,
    title: "Open and Permissionless",
    keyPoints: [
      {
        text: "No signups, no approval needed — anyone can participate",
        example: "Example: Send $10,000 globally in minutes with just a wallet address"
      },
      {
        text: "True digital ownership: internet-native assets that work everywhere", 
        example: "Example: Buy a digital skin in one game, use it across 10 others, then sell it when you're done"
      },
      {
        text: "No centralized authority to freeze, censor, or block access",
        example: "Example: Tornado Cash users continued operating despite government bans"
      }
    ],
    icon: "🌐"
  },
  {
    id: 2,
    title: "OK, but how?",
    keyPoints: [
      {
        magicWord: "Immutable",
        text: "Code replaces trust: Once deployed, contracts cannot be modified",
        example: "Example: MakerDAO's code has controlled billions for years without changes"
      },
      {
        magicWord: "Autonomous",
        text: "Eliminates middlemen and manual processes",
        example: "Example: Uniswap processes $1B+ daily with zero human intervention • DeFi liquidations trigger instantly when collateral drops below 150%"
      }
    ],
    icon: "📜"
  },
  {
    id: 3,
    title: "Mighty Composability",
    keyPoints: [
      {
        text: "Protocols are building blocks — like Legos",
        example: "Example: Yearn Finance combines Curve + Compound + Convex in one click"
      },
      {
        text: "Developers can combine existing contracts to create new apps fast",
        example: "Example: 1inch aggregates 100+ DEXs to find the best swap prices"
      },
      {
        text: "Ecosystem grows exponentially as each piece adds value",
        example: "Example: DeFi TVL grew from $1B to $200B+ by building on each other"
      }
    ],
    icon: "🧱"
  },
  {
    id: 4,
    title: "Decentralization Guarantees Security",
    keyPoints: [
      {
        text: "Thousands of nodes = no single point of failure",
        example: "Example: 1,000,000+ validators across 6 continents secure the network"
      },
      {
        text: "Secured by economic incentives + strong consensus",
        example: "Example: $90B+ staked ETH makes attacks economically impossible"
      },
      {
        text: "Resistant to censorship, shutdown, or control",
        example: "Example: Ethereum survived The DAO hack, government pressure, and market crashes"
      }
    ],
    icon: "🔒"
  },
  {
    id: 5,
    title: "How Ethereum Delivers Today",
    subtitle: "Technology & Implementation",
    content: "From core principles to cutting-edge solutions — how Ethereum scales and evolves.",
    type: "section"
  },
  {
    id: 6,
    title: "Proof of Stake Revolution",
    keyPoints: [
      {
        text: "99.9% energy reduction while maintaining security",
        example: "Ethereum now uses less energy than Netflix streaming"
      },
      {
        text: "Staking democratizes network participation",
        example: "1M+ validators earning 4-7% APR on staked ETH"
      },
      {
        text: "Enhanced economic security through slashing conditions",
        example: "Validators lose staked ETH for malicious behavior or downtime"
      }
    ],
    icon: "🌱"
  },
  {
    id: 7,
    title: "Scaling Through Layer 2s",
    keyPoints: [
      {
        text: "Ethereum mainnet as settlement layer, L2s for execution",
        example: "Example: Arbitrum processes 40+ TPS with $0.10 transaction fees vs $5+ on mainnet"
      },
      {
        text: "Optimistic and ZK rollups inherit Ethereum's security",
        example: "Example: Polygon zkEVM proves transaction validity with zero-knowledge cryptography"
      },
      {
        text: "Cross-chain interoperability",
        example: "Example: Move USDC from Ethereum to Optimism in under 2 minutes"
      }
    ],
    icon: "⚡"
  },
  {
    id: 8,
    title: "Developer Ecosystem",
    keyPoints: [
      {
        text: "EVM compatibility enables massive developer adoption",
        example: "4,000+ active developers building on Ethereum monthly"
      },
      {
        text: "Rich tooling ecosystem from testing to deployment",
        example: "Wagmi, Hardhat, Foundry make development seamless"
      },
      {
        text: "Established patterns and libraries accelerate building",
        example: "OpenZeppelin contracts used by 90% of projects for security standards"
      }
    ],
    icon: "🛠️"
  },
  {
    id: 9,
    title: "Why This Matters",
    keyPoints: [
      {
        text: "Ethereum gives anyone access to global finance, ownership, and innovation",
        example: "Example: Farmers in Kenya access crop insurance via smartphone wallets"
      },
      {
        text: "It's not just tech — it's a new layer of digital freedom",
        example: "Example: Artists earn lifetime royalties from NFT sales automatically"
      },
      {
        text: "Real-world impact: DeFi in emerging markets, NFT royalties, DAO governance",
        example: "Example: MakerDAO governs $5B+ through decentralized voting by token holders"
      }
    ],
    icon: "🌟"
  },
  {
    id: 10,
    title: "Happy 10th Birthday, Ethereum! 🎉",
    subtitle: "A Decade of Decentralized Innovation",
    content: "July 30, 2025 marks 10 incredible years since Ethereum went live. From a simple idea to the world's computer — Ethereum has enabled $500B+ in DeFi, millions of NFTs, thousands of DAOs, and countless innovations that didn't exist before. Here's to the next decade of building the decentralized future.",
    callToAction: "The journey continues — be part of it.",
    type: "closing"
  },
  {
    id: 11,
    title: "Latest News",
    type: "section"
  },
  {
    id: 12,
    tweetId: "1925653898548649999",
    type: "news"
  },
  {
    id: 13,
    tweetId: "1925223660111176101",
    type: "news"
  },
  {
    id: 14,
    tweetId: "1925118054759022808",
    type: "news"
  },
  {
    id: 15,
    tweetId: "1925657285965062547",
    type: "news"
  },
  {
    id: 16,
    tweetId: "1925857790368637360",
    type: "news"
  }
]

const EmbeddedTweet = ({ tweetId }) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div className="embedded-tweet">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={`https://twitter.com/blockworksres/status/${tweetId}`}>Loading tweet...</a>
      </blockquote>
    </div>
  )
}

const Slide = ({ slide, isActive }) => {
  if (slide.type === "title") {
    return (
      <div className={`slide title-slide ${isActive ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="main-title">{slide.title}</h1>
          <h2 className="subtitle">{slide.subtitle}</h2>
          <p className="description">{slide.content}</p>
        </div>
      </div>
    )
  }

  if (slide.type === "section") {
    return (
      <div className={`slide section-slide ${isActive ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="section-title">{slide.title}</h1>
          <h2 className="section-subtitle">{slide.subtitle}</h2>
          <p className="section-description">{slide.content}</p>
        </div>
      </div>
    )
  }

  if (slide.type === "closing") {
    return (
      <div className={`slide closing-slide ${isActive ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="closing-title">{slide.title}</h1>
          <h2 className="closing-subtitle">{slide.subtitle}</h2>
          <p className="closing-description">{slide.content}</p>
          <p className="call-to-action">{slide.callToAction}</p>
        </div>
      </div>
    )
  }

  if (slide.type === "news") {
    return (
      <div className={`slide news-slide ${isActive ? 'active' : ''}`}>
        <div className="slide-content">
          <p className="news-description">{slide.content}</p>
          <div className="embedded-tweet-small">
            <EmbeddedTweet tweetId={slide.tweetId} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content">
        <div className="slide-icon">{slide.icon}</div>
        <h2 className="slide-title">{slide.title}</h2>
        
        <div className="key-points">
          {slide.keyPoints.map((point, index) => (
            <div key={index} className={`key-point ${point.magicWord ? 'has-magic-word' : ''}`}>
              {!point.magicWord && <span className="bullet">•</span>}
              <div className="point-content">
                {point.magicWord && (
                  <div className="magic-word-inline">
                    <div className={`magic-word magic-word-${index + 1}`}>
                      {point.magicWord}
                    </div>
                  </div>
                )}
                <span className="point-text">{point.text}</span>
                <span className="point-example">{point.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Navigation = ({ currentSlide, totalSlides, onNext, onPrev, onSlideSelect }) => (
  <div className="navigation">
    <button 
      className="nav-btn prev" 
      onClick={onPrev}
      disabled={currentSlide === 0}
    >
      ←
    </button>
    
    <div className="slide-indicators">
      {Array.from({ length: totalSlides }, (_, i) => (
        <button
          key={i}
          className={`indicator ${i === currentSlide ? 'active' : ''}`}
          onClick={() => onSlideSelect(i)}
        />
      ))}
    </div>
    
    <button 
      className="nav-btn next" 
      onClick={onNext}
      disabled={currentSlide === totalSlides - 1}
    >
      →
    </button>
  </div>
)

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextSlide()
    if (e.key === 'ArrowLeft') prevSlide()
  }

  return (
    <div className="slideshow" onKeyDown={handleKeyDown} tabIndex={0}>
      <ShaderBackground />
      <div className="slides-container">
        {slides.map((slide, index) => (
          <Slide 
            key={slide.id} 
            slide={slide} 
            isActive={index === currentSlide}
          />
        ))}
      </div>
      
      <Navigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNext={nextSlide}
        onPrev={prevSlide}
        onSlideSelect={goToSlide}
      />
      
      <div className="slide-counter">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}

export default App


