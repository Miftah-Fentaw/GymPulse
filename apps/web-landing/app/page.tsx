import React from 'react'
import Image from 'next/image'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-sans bg-[#0a0d11] text-white">

      {/* Fixed navbar — floats above everything, scroll-aware */}
      <Navbar />

      {/* ─────────────────────────────────────────────
          1. Hero — full viewport, video background
      ───────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
        {/* Background video — /public/hero.mp4 (replace with your gym footage) */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay — heavier at bottom so hero bleeds into next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#0a0d11]" />

        {/* Hero content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="flex flex-col text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem]">
            <span>TRANSFORM YOUR</span>
            <span className="text-[#ff9045]">BODY</span>
            <span>ELEVATE YOUR LIFE</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/60 md:text-lg">
            Join GymPulse and unlock elite training programs, expert coaching, and a community built around results.
          </p>
          <button className="mt-10 rounded-full bg-[#ff9045] px-10 py-4 text-base font-bold uppercase text-black transition-transform hover:scale-105">
            JOIN NOW
          </button>

          {/* Scroll cue */}
          <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs uppercase tracking-widest text-white/40">Scroll</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. Why GymPulse
      ───────────────────────────────────────────── */}
      <section className="flex w-full flex-col items-center px-6 py-24 lg:px-20">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wide md:text-4xl">
            WHY <span className="text-[#ff9045]">GYMPULSE</span>
          </h2>
          <p className="text-lg text-gray-400">
            We don&apos;t just build bodies, we forge champions. Our commitment to excellence drives every workout, every meal plan, every transformation.
          </p>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center rounded-3xl bg-[#111315] p-10 text-center border border-white/5 transition-transform hover:-translate-y-2">
            <div className="mb-6 rounded-full bg-[#ff9045]/10 p-5 text-[#ff9045]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold uppercase tracking-wide">STRENGTH</h3>
            <p className="text-gray-400">Build unbreakable physical and mental strength through our proven training methods.</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center rounded-3xl bg-[#111315] p-10 text-center border border-white/5 transition-transform hover:-translate-y-2">
            <div className="mb-6 rounded-full bg-[#ff9045]/10 p-5 text-[#ff9045]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold uppercase tracking-wide">ENDURANCE</h3>
            <p className="text-gray-400">Push past your limits and discover what your body is truly capable of achieving.</p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center rounded-3xl bg-[#111315] p-10 text-center border border-white/5 transition-transform hover:-translate-y-2">
            <div className="mb-6 rounded-full bg-[#ff9045]/10 p-5 text-[#ff9045]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold uppercase tracking-wide">TRANSFORMATION</h3>
            <p className="text-gray-400">Complete body and mind transformation with our comprehensive fitness ecosystem.</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. Training Programs
      ───────────────────────────────────────────── */}
      <section className="flex w-full flex-col items-center bg-[#111315] px-6 py-24 lg:px-20">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wide md:text-4xl">
            TRAINING <span className="text-[#ff9045]">PROGRAMS</span>
          </h2>
          <p className="text-lg text-gray-400">
            Choose from our elite training programs designed by world-class athletes and certified trainers.
          </p>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: 'Personal Training',
              subtitle: 'One-on-one sessions with certified trainers',
              image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
              bullets: ['Custom workout plans', 'Nutrition guidance', 'Progress tracking'],
            },
            {
              title: 'Group Classes',
              subtitle: 'High-energy group workouts for all levels',
              image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
              bullets: ['HIIT', 'Yoga', 'Spin classes'],
            },
            {
              title: 'Strength Training',
              subtitle: 'Build muscle and increase power',
              image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
              bullets: ['Free weights', 'Machines', 'Olympic lifting'],
            },
          ].map((program, idx) => (
            <div key={idx} className="flex flex-col overflow-hidden rounded-3xl bg-[#0a0d11] border border-white/5">
              <img src={program.image} alt={program.title} className="h-56 w-full object-cover" />
              <div className="flex flex-1 flex-col p-8">
                <h3 className="mb-2 text-2xl font-bold">{program.title}</h3>
                <p className="mb-6 text-sm text-gray-400">{program.subtitle}</p>
                <ul className="mb-8 flex flex-col gap-3">
                  {program.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="rounded-full bg-[#ff9045]/20 p-1 text-[#ff9045]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <button className="w-full rounded-full border border-[#ff9045] bg-transparent py-3 font-bold text-[#ff9045] transition-colors hover:bg-[#ff9045] hover:text-black">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. Success Stories
      ───────────────────────────────────────────── */}
      <section className="flex w-full flex-col items-center px-6 py-24 lg:px-20">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wide md:text-4xl">
            SUCCESS <span className="text-[#ff9045]">STORIES</span>
          </h2>
          <p className="text-lg text-gray-400">
            Real transformations from real people. See what&apos;s possible when you commit to excellence.
          </p>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Sarah Johnson', text: 'GymPulse transformed my life! The trainers are amazing.' },
            { name: 'Mike Chen', text: 'From couch potato to marathon runner in just 8 months.' },
            { name: 'Jessica Rodriguez', text: 'Best gym environment I\'ve ever experienced.' },
            { name: 'David Thompson', text: 'Lost 40 pounds and built lean muscle. Incredible.' },
            { name: 'Amanda Park', text: 'The group classes keep me motivated every single day.' },
            { name: 'Carlos Martinez', text: 'Elite equipment and a community that actually cares.' },
          ].map((testimonial, idx) => (
            <div key={idx} className="flex flex-col justify-between rounded-3xl bg-[#111315] p-8 border border-white/5">
              <div>
                <div className="mb-4 flex gap-1 text-[#ff9045]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="mb-8 text-lg text-gray-300">&quot;{testimonial.text}&quot;</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff9045] font-bold text-black text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <span className="font-bold">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. Gallery
      ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 w-full md:grid-cols-4">
        {[
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
        ].map((img, idx) => (
          <img key={idx} src={img} alt={`Gallery image ${idx + 1}`} className="aspect-square w-full object-cover grayscale transition-all hover:grayscale-0" />
        ))}
      </section>

      {/* ─────────────────────────────────────────────
          6. Footer — one unified image background
      ───────────────────────────────────────────── */}
      <footer className="relative w-full overflow-hidden">

        {/* Gym image fills the entire footer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        {/* Strong dark overlay — enough contrast for all text */}
        <div className="absolute inset-0 bg-black/75" />

        {/* All footer content sits above the overlay */}
        <div className="relative z-10">

          {/* Links + brand block */}
          <div className="mx-auto max-w-7xl px-8 pt-16 pb-14 lg:px-16">
            <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">

              {/* Left: Brand block */}
              <div className="flex max-w-xs flex-col gap-4">
                <Image src="/nobg1.png" alt="GymPulse" width={130} height={44} className="object-contain" />

                <p className="text-xl font-bold leading-snug text-white">Your smart fitness hub</p>

                <p className="text-sm leading-relaxed text-white/60">
                  GymPulse brings workout tracking, class bookings, nutrition plans, progress stats, and expert coaching into one powerful platform built for your goals.
                </p>

                <button className="mt-2 flex w-fit items-center gap-2 rounded-full bg-[#ff9045] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1 14.5v-9l6.5 4.5-6.5 4.5Z"/>
                  </svg>
                  Start for free
                </button>

                <p className="mt-2 text-xs text-white/40">© 2026 GymPulse · All rights reserved</p>

                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>Built with</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#e05555" stroke="#e05555" strokeWidth="1">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>by the GymPulse team</span>
                </div>
              </div>

              {/* Right: Link columns */}
              <div className="flex flex-wrap gap-12 md:gap-16">
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-black uppercase tracking-wider text-white">Menu</h4>
                  {['Home', 'Features', 'FAQ', 'Pricing', 'Updates'].map((item) => (
                    <a key={item} href="#" className="text-base font-bold text-white/80 transition-colors hover:text-[#ff9045]">{item}</a>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-black uppercase tracking-wider text-white">Navigation</h4>
                  {['Contact', 'Roadmap', 'Privacy policy', 'Terms of service', 'Member portal'].map((item) => (
                    <a key={item} href="#" className="text-base font-bold text-white/80 transition-colors hover:text-[#ff9045]">{item}</a>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-black uppercase tracking-wider text-white">More</h4>
                  {['Programs', 'Trainers', 'Nutrition', 'Community', 'Blog', 'Careers', 'Press kit'].map((item) => (
                    <a key={item} href="#" className="text-base font-bold text-white/80 transition-colors hover:text-[#ff9045]">{item}</a>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-black uppercase tracking-wider text-white">Connect</h4>
                  {['Instagram', 'Twitter / X', 'YouTube', 'Facebook', 'TikTok', 'LinkedIn'].map((item) => (
                    <a key={item} href="#" className="text-base font-bold text-white/80 transition-colors hover:text-[#ff9045]">{item}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto max-w-7xl px-8 lg:px-16">
            <div className="border-t border-white/10" />
          </div>

          {/* Big GymPulse wordmark — same background, no separate strip */}
          <p
            className="select-none whitespace-nowrap text-center font-black uppercase leading-none tracking-tight text-white mix-blend-overlay"
            style={{ fontSize: 'clamp(4rem, 16vw, 14rem)' }}
          >
            GymPulse
          </p>

        </div>
      </footer>
    </main>
  )
}
