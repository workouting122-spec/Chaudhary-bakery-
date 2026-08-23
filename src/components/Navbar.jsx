import { useEffect, useState } from 'react'
import { SearchIcon, Chevron, MenuIcon } from './icons.jsx'
import './Navbar.css'

const LINKS = ['Home', 'How It Works', 'Philosophy', 'Use Cases']

const hrefFor = (label) => `#${label.toLowerCase().replace(/\s+/g, '-')}`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="nav">
      <div className="nav__inner shell">
        <a className="nav__brand" href="#top">
          Aethera
        </a>

        <nav className="nav__rail" aria-label="Primary">
          {LINKS.map((label, i) => (
            <span className="nav__slot" key={label}>
              {i !== 0 && <span className="nav__dot" aria-hidden="true" />}
              <a href={hrefFor(label)}>{label}</a>
            </span>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__lang">
            EN <Chevron />
          </button>
          <button className="nav__search" aria-label="Search">
            <SearchIcon />
          </button>
        </div>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          {LINKS.map((label) => (
            <a key={label} href={hrefFor(label)} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
