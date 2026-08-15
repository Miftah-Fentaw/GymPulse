export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
          Built for modern gyms
        </div>

        <section className="mt-8 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Fitness operations, reimagined
            </p>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Grow your gym with a smarter member experience.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              GymPulse unifies bookings, class management, memberships, and retail in one seamless platform built for high-performing fitness businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#get-started"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Book a demo
              </a>
              <a
                href="#learn-more"
                className="rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/30 ring-1 ring-white/5">
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">This week</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                  +28.4%
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-end justify-between text-slate-300">
                    <span>Member check-ins</span>
                    <span className="text-lg font-semibold text-white">1,284</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-[82%] rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-end justify-between text-slate-300">
                    <span>Class attendance</span>
                    <span className="text-lg font-semibold text-white">92%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-[92%] rounded-full bg-cyan-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-end justify-between text-slate-300">
                    <span>Revenue</span>
                    <span className="text-lg font-semibold text-white">$24.8k</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-[76%] rounded-full bg-violet-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
