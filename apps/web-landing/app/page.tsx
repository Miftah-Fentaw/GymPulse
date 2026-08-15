import React from 'react'

const navItems = ['HOME', 'ABOUT', 'PROGRAMS', 'TESTIMONIALS']

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-sans bg-[#0a0d11] text-white">
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#0a0d11]/90 px-6 py-4 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff9045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.409 13.017A5.04 5.04 0 0 0 9 15H5.824a2.81 2.81 0 0 0-2.786 2.414l-.39 2.922A.72.72 0 0 0 3.364 21h9.362a.72.72 0 0 0 .716-.628l.582-4.954a2.82 2.82 0 0 0-1.615-2.401M16.5 6.42 15 5a2 2 0 0 0-2.83 0l-1.63 1.63a6 6 0 0 1-5.32 1.63 1 1 0 0 0-1.07 1.54l6 7a1 1 0 0 0 1.5-.07l2.84-3.57a4.06 4.06 0 0 1 5.34-1l.73.5a2 2 0 0 0 2.85-2.31l-.22-.65a2 2 0 0 0-2.53-1.3l-4.17 1.4z"/></svg>
          <span className="text-xl font-bold tracking-wide">Fit Zone</span>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="transition-colors hover:text-[#ff9045]">
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button className="rounded-full bg-[#ff9045] px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105">
          Join Now
        </button>
      </header>

      {/* 2. Hero Section */}
      <section
        className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6">
          <h1 className="flex flex-col text-5xl font-black uppercase tracking-tight md:text-7xl lg:text-8xl">
            <span>TRANSFORM YOUR</span>
            <span className="text-[#ff9045]">BODY</span>
            <span>ELEVATE YOUR LIFE</span>
          </h1>
          <button className="mt-8 rounded-full bg-[#ff9045] px-10 py-4 text-lg font-bold uppercase text-black transition-transform hover:scale-105">
            JOIN NOW
          </button>
        </div>
      </section>

      {/* 3. Why Fit Zone Section */}
      <section className="flex w-full flex-col items-center px-6 py-24 lg:px-20">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wide md:text-4xl">
            WHY <span className="text-[#ff9045]">FIT ZONE</span>
          </h2>
          <p className="text-lg text-gray-400">
            We don't just build bodies, we forge champions. Our commitment to excellence drives every workout, every meal plan, every transformation.
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

      {/* 4. Training Programs Section */}
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
              title: "Personal Training",
              subtitle: "One-on-one sessions with certified trainers",
              image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
              bullets: ["Custom workout plans", "Nutrition guidance", "Progress tracking"]
            },
            {
              title: "Group Classes",
              subtitle: "High-energy group workouts for all levels",
              image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
              bullets: ["HIIT", "Yoga", "Spin classes"]
            },
            {
              title: "Strength Training",
              subtitle: "Build muscle and increase power",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
              bullets: ["Free weights", "Machines", "Olympic lifting"]
            }
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

      {/* 5. Success Stories */}
      <section className="flex w-full flex-col items-center px-6 py-24 lg:px-20">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wide md:text-4xl">
            SUCCESS <span className="text-[#ff9045]">STORIES</span>
          </h2>
          <p className="text-lg text-gray-400">
            Real transformations from real people. See what's possible when you commit to excellence.
          </p>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Sarah Johnson", text: "Fit Zone transformed my life! The trainers are amazing." },
            { name: "Mike Chen", text: "From couch potato to marathon runner in just 8 months." },
            { name: "Jessica Rodriguez", text: "Best gym environment I've ever experienced." },
            { name: "David Thompson", text: "Lost 40 pounds and built lean muscle. Incredible." },
            { name: "Amanda Park", text: "The group classes keep me motivated every single day." },
            { name: "Carlos Martinez", text: "Elite equipment and a community that actually cares." },
          ].map((testimonial, idx) => (
            <div key={idx} className="flex flex-col justify-between rounded-3xl bg-[#111315] p-8 border border-white/5">
              <div>
                <div className="mb-4 flex gap-1 text-[#ff9045]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="mb-8 text-lg text-gray-300">"{testimonial.text}"</p>
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

      {/* 6. Gallery */}
      <section className="grid grid-cols-2 w-full md:grid-cols-4">
        {[
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80"
        ].map((img, idx) => (
          <img key={idx} src={img} alt={`Gallery image ${idx + 1}`} className="aspect-square w-full object-cover grayscale transition-all hover:grayscale-0" />
        ))}
      </section>

      {/* 7. Footer & CTA */}
      <footer className="w-full bg-[#050608]">
        <div className="mx-auto flex max-w-7xl flex-col px-6 py-20 lg:px-20">
          
          {/* Top Footer Columns */}
          <div className="grid grid-cols-1 gap-12 pb-16 md:grid-cols-4">
            {/* Col 1 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff9045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.409 13.017A5.04 5.04 0 0 0 9 15H5.824a2.81 2.81 0 0 0-2.786 2.414l-.39 2.922A.72.72 0 0 0 3.364 21h9.362a.72.72 0 0 0 .716-.628l.582-4.954a2.82 2.82 0 0 0-1.615-2.401M16.5 6.42 15 5a2 2 0 0 0-2.83 0l-1.63 1.63a6 6 0 0 1-5.32 1.63 1 1 0 0 0-1.07 1.54l6 7a1 1 0 0 0 1.5-.07l2.84-3.57a4.06 4.06 0 0 1 5.34-1l.73.5a2 2 0 0 0 2.85-2.31l-.22-.65a2 2 0 0 0-2.53-1.3l-4.17 1.4z"/></svg>
                <span className="text-xl font-bold tracking-wide">Fit Zone</span>
              </div>
              <p className="text-sm text-gray-400">Transform your body, elevate your life. Join the Fit Zone revolution today.</p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 transition hover:bg-[#ff9045] hover:text-black">FB</div>
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 transition hover:bg-[#ff9045] hover:text-black">IG</div>
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 transition hover:bg-[#ff9045] hover:text-black">TW</div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold">Quick Links</h4>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Home</a>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">About</a>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Programs</a>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Testimonials</a>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold">Programs</h4>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Personal Training</a>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Group Classes</a>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Strength Training</a>
              <a href="#" className="text-gray-400 hover:text-[#ff9045]">Nutrition Plans</a>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold">Contact</h4>
              <span className="text-gray-400">(555) 123-4567</span>
              <span className="text-gray-400">info@fitzone.com</span>
              <span className="text-gray-400">123 Fitness St,<br/>City, State 12345</span>
            </div>
          </div>

          {/* Middle CTA Banner */}
          <div className="mb-12 flex w-full flex-col items-center justify-between gap-6 rounded-3xl bg-[#ff9045] p-12 md:flex-row">
            <div className="flex flex-col gap-2 text-black">
              <h3 className="text-2xl font-black uppercase md:text-3xl">READY TO START YOUR TRANSFORMATION?</h3>
              <p className="font-medium text-black/80">Join thousands of members who have already transformed their lives.</p>
            </div>
            <button className="whitespace-nowrap rounded-full bg-black px-8 py-4 font-bold text-[#ff9045] transition-transform hover:scale-105">
              GET STARTED TODAY
            </button>
          </div>

          {/* Bottom Copyright */}
          <div className="flex justify-center border-t border-white/10 pt-8 text-sm text-gray-500">
            © 2024 Fit Zone Gym. All rights reserved. Transform your limits.
          </div>
        </div>
      </footer>
    </main>
  )
}
