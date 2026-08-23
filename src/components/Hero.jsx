import { useEffect, useRef, useState } from 'react'
import { Star } from './icons.jsx'
import './Hero.css'

const HERO_VIDEO_URL = '/hero.mp4'

export default function Hero() {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const play = video.play() // some browsers block autoplay until nudged
    if (play?.catch) play.catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      setReady(true) // still fade it in — just frozen on frame one
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        <video
          ref={videoRef}
          className={`hero__video ${ready ? 'is-ready' : ''}`}
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
        />
        <div className="hero__scrim" />
      </div>

      <div className="hero__body shell">
        <h1 className="hero__title">
          A New Kind of Intelligence
          <br />– Human at Heart
        </h1>
        <p className="hero__sub">
          Aethera is a collaborative AI designed to elevate thought, co-create ideas, and build
          with empathy. It's in sync with how you think and feel.
        </p>
        <a className="btn hero__cta" href="#how">
          See How It Works
        </a>
      </div>

      <div className="rating shell">
        <span className="rating__count">Reviews 1,042</span>
        <ul className="rating__stars" aria-label="Rated 5 out of 5">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}>
              <Star />
            </li>
          ))}
        </ul>
        <span className="rating__score">Excellent Score</span>
      </div>
    </section>
  )
}
