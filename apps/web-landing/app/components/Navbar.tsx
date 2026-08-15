'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const navItems = ['HOME', 'ABOUT', 'PROGRAMS', 'TESTIMONIALS']

export default function Navbar() {
  // true  = scrolled past hero → show frosted bar
  const [scrolled, setScrolled] = useState(false)
  // true  = hide bar (scrolling down), false = show bar
  const [hidden, setHidden] = useState(false)
  // mobile menu open
  const [menuOpen, setMenuOpen] = useState(false)

  const lastY = useRef(0)

  useEffect(() => {
    const heroHeight =
      typeof window !== 'undefined' ? window.innerHeight : 600

    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current

      // Past hero → add frosted bg
      setScrolled(y > heroHeight * 0.6)

      // Hide on scroll-down (only after leaving hero), show on scroll-up
      if (y > heroHeight * 0.3) {
        setHidden(goingDown && y > lastY.current + 8)
      } else {
        setHidden(false)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between px-6 md:px-10 py-4',
        'transition-all duration-300 ease-in-out',
        // slide up when hidden
        hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
        // frosted dark bar after hero, transparent over it
        scrolled
          ? 'bg-[#0a0d11]/80 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/nobg1.png"
          alt="GymPulse"
          width={110}
          height={36}
          className="object-contain"
          priority
        />
      </div>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 lg:flex">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className={[
              'text-sm font-black uppercase tracking-widest transition-colors',
              scrolled ? 'text-white/70 hover:text-[#ff9045]' : 'text-white/90 hover:text-[#ff9045]',
            ].join(' ')}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* CTA + mobile hamburger */}
      <div className="flex items-center gap-4">
        <button className="hidden rounded-full bg-[#ff9045] px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 sm:block">
          Join Now
        </button>

        {/* Hamburger — mobile only */}
        <button
          className="flex flex-col gap-1.5 lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={[
              'block h-0.5 w-6 bg-white transition-transform duration-300',
              menuOpen ? 'translate-y-2 rotate-45' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block h-0.5 w-6 bg-white transition-opacity duration-300',
              menuOpen ? 'opacity-0' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block h-0.5 w-6 bg-white transition-transform duration-300',
              menuOpen ? '-translate-y-2 -rotate-45' : '',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          'absolute left-0 right-0 top-full flex flex-col gap-6 bg-[#0a0d11]/95 px-8 py-8 backdrop-blur-md lg:hidden',
          'transition-all duration-300 ease-in-out',
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="text-lg font-black uppercase tracking-widest text-white/80 hover:text-[#ff9045]"
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
        <button className="mt-2 w-fit rounded-full bg-[#ff9045] px-6 py-2.5 text-sm font-bold text-black">
          Join Now
        </button>
      </div>
    </header>
  )
}
