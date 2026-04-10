import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface HomeProps {
  isAuthenticated: boolean | null
}

export const Home: React.FC<HomeProps> = ({ isAuthenticated }) => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    document.title = 'Home | Bun Elysia Fullstack'
    
    const handleScroll = () => {
      // Appear when scrolled down more than 400px
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className="relative w-full overflow-x-hidden font-sans selection:bg-pink-500/30 selection:text-pink-200 scroll-smooth">
      {/* Floating GitHub Badge (Desktop Only) */}
      <a 
        href="https://github.com/luxorwannabe/bun-elysia-fullstack" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-100 hidden md:flex items-center justify-center gap-3 px-7 py-3 rounded-full backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all duration-500 group group-hover:border-indigo-500/50"
      >
         <div className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white relative z-10 group-hover:rotate-12 transition-transform duration-500">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
         </svg>
         <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase relative z-10">Star on GitHub</span>
      </a>

      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] right-[15%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="absolute bottom-[40%] left-[10%] w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto py-20 px-6 sm:px-10 space-y-28 pb-32">
        
        {/* --- Hero Section --- */}
        <section id="hero" className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-10 relative">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 mr-2 animate-ping"></span>
            Version 1.0.0 Now Available
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-none max-w-5xl px-4">
            The Speed of <span className="bg-linear-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent italic">Elysia</span> in your Browser.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed px-6">
            A production-ready fullstack boilerplate combining the raw power of <span className="bg-linear-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent font-black tracking-tight">Bun</span>, 
            the ergonomics of <span className="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent font-black tracking-tight">ElysiaJS</span>, and the flexibility of <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-black tracking-tight">React 19</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 w-full">
            {isAuthenticated ? (
              <Link 
                to="/profile" 
                className="w-full sm:w-auto px-12 py-5 bg-white text-black hover:bg-slate-200 font-black rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95 text-center"
              >
                Go to Profile
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 text-center"
                >
                  Get Started
                </Link>
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl border border-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-md active:scale-95 text-center"
                >
                  Create Account
                </Link>
              </>
            )}
            <a 
              href="/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-5 text-slate-400 hover:text-white font-bold transition-all group"
            >
              Explore API Docs
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </div>
        </section>

        {/* --- Key Features Section --- */}
        <section id="features" className="space-y-16 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
             <div className="space-y-6">
                <span className="text-pink-500 font-black tracking-widest text-xs uppercase px-3 py-1 bg-pink-500/10 rounded-lg">Performance First</span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Everything you need, <br/><span className="bg-linear-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">None of the bloat.</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                   Stop spending hours on boilerplate setup. This kit gives you a professional-grade architecture out of the box.
                </p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Bun Native', desc: 'Fastest-in-class performance.' },
                  { title: 'JWT + HttpOnly', desc: 'Secure Auth with Refresh tokens.' },
                  { title: 'Drizzle ORM', desc: 'High-speed typesafe database ops.' },
                  { title: 'Eden Treaty', desc: 'End-to-end typesafe API calls.' },
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-sm">
                     <div className="text-white font-black mb-1">{item.title}</div>
                     <p className="text-slate-500 text-sm italic">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
            {[
              { 
                title: '⚡ Lightning Fast', 
                desc: 'Powered by Bun, achieving sub-millisecond response times for core API endpoints.', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> 
              },
              { 
                title: '🔒 Secure Auth', 
                desc: 'Production-grade JWT with HttpOnly cookies, security headers, and rate limiting built-in.', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 
              },
              { 
                title: '📖 Auto-Docs', 
                desc: 'Integrated Swagger UI that syncs with your code. Always accurate, always online.', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg> 
              },
            ].map((f) => (
              <div key={f.title} className="p-10 rounded-3xl md:rounded-[40px] border border-white/5 bg-white/5 backdrop-blur-sm group hover:border-white/20 hover:bg-white/10 transition-all duration-500 shadow-2xl overflow-hidden relative">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                <div className="p-4 w-fit rounded-2xl bg-slate-950 border border-white/5 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Quick Start Stepper --- */}
        <section id="steps" className="space-y-16 py-12 scroll-mt-20">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Get Running in <span className="bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent italic underline decoration-transparent hover:decoration-indigo-500/50 underline-offset-8">Minutes.</span></h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">Follow these simple steps to launch your fullstack application.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 overflow-x-auto pb-4">
              {[
                { step: '01', title: 'Prepare', desc: 'Install Bun v1.1+ and MySQL.' },
                { step: '02', title: 'Install', desc: 'Run `bun install` in the root.' },
                { step: '03', title: 'Config', desc: 'Setup .env from .env.example.' },
                { step: '04', title: 'Launch', desc: 'Run `bun dev` to start apps.' },
              ].map((s, i) => (
                <div key={i} className="shrink-0 min-w-[240px] p-8 rounded-2xl md:rounded-[35px] bg-slate-900 border border-white/5 relative group transition-all duration-300 hover:border-indigo-500/30">
                   <div className="text-6xl font-black text-indigo-400/30 absolute top-4 right-8 group-hover:text-indigo-400/50 transition-colors uppercase italic">{s.step}</div>
                   <div className="space-y-3 relative z-10">
                      <h4 className="text-xl font-black text-white">{s.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                   </div>
                   {i < 3 && <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-800 z-10">&rarr;</div>}
                </div>
              ))}
           </div>
        </section>

        {/* --- CLI Developer Toolkit --- */}
        <section id="cli-toolkit" className="p-12 rounded-3xl md:rounded-[50px] border border-white/5 bg-slate-950/50 backdrop-blur-xl space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-pink-500/5 opacity-50"></div>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
              <div className="space-y-3">
                 <h3 className="text-3xl font-black text-white tracking-tight">CLI Developer <span className="bg-linear-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">Toolkit</span></h3>
                 <p className="text-slate-500 font-medium">Productivity at your fingertips with Bun commands.</p>
              </div>
              <a href="#cli-toolkit" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors group flex items-center gap-2">
                 View Component Cheat-sheet <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {[
                { cmd: 'bun dev', desc: 'Launch Concurrent Dev Servers', label: 'Recommended' },
                { cmd: 'bun run test', desc: 'Run Comprehensive Test Suite', label: 'Unit/API' },
                { cmd: 'bun run build', desc: 'Generate Production Bundle', label: 'Deployment' },
                { cmd: 'bun db:generate', desc: 'Sync Drizzle Schema Files', label: 'Database' },
                { cmd: 'bun db:migrate', desc: 'Push Schema to Database', label: 'Database' },
                { cmd: 'bun add <pkg>', desc: 'Add Dependencies to Monorepo', label: 'Workflow' },
              ].map((c) => (
                <div key={c.cmd} className="flex flex-col p-6 rounded-3xl bg-black border border-white/5 hover:border-white/10 transition-colors group">
                   <div className="flex justify-between items-start mb-4">
                      <code className="text-pink-400 font-mono text-sm bg-pink-400/5 px-2 py-1 rounded-md">{c.cmd}</code>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 border border-slate-700/50 px-2 py-0.5 rounded-full">{c.label}</span>
                   </div>
                   <p className="text-slate-400 text-xs font-medium leading-relaxed mt-auto">{c.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* --- Architecture & Tech Stack (Enhanced) --- */}
        <section id="architecture" className="space-y-16 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl md:rounded-[40px] bg-slate-900 border border-white/10 overflow-hidden shadow-2xl group flex flex-col order-2 lg:order-1">
               <div className="p-4 border-b border-white/5 flex gap-2 items-center bg-black/40">
                  <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                  <div className="mx-auto text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-4">process | bun v1.1.2</div>
               </div>
               <div className="flex-1 p-8 font-mono text-sm overflow-hidden relative overflow-y-auto">
                  <div className="space-y-2">
                    <p className="text-indigo-400">$ bun dev</p>
                    <p className="text-white/60 mb-4">[0] @bun-elysia-fullstack/api starting...</p>
                    <p className="text-cyan-400">🚀 ElysiaJS Server Running</p>
                    <p className="text-slate-500">  ➜ Local: http://localhost:3000</p>
                    <p className="text-slate-500">  ➜ Docs:  http://localhost:3000/docs</p>
                    
                    <div className="pt-6 space-y-1">
                      <p className="text-white/60">[1] @bun-elysia-fullstack/web starting...</p>
                      <p className="text-violet-400">⚛️ React + Vite v6 Active</p>
                      <p className="text-slate-500">  ➜ Local: http://localhost:5173</p>
                      <p className="text-pink-500">✨ Tailwind v4 Engines Activated</p>
                    </div>

                    <div className="pt-8 space-y-2">
                      <p className="text-amber-400">📦 Connected to storage provider: Local</p>
                      <p className="text-emerald-400 animate-pulse">✓ Ready for Development.</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>
               </div>
            </div>

            <div className="space-y-10 order-1 lg:order-2">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                   Modern <span className="bg-linear-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent italic">Monorepo</span> <br />Design Pattern.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                   The boilerplate is structured with Bun Workspaces to maximize code reuse and maintain strict typesafety across your environment.
                </p>
              </div>
              
              <div className="space-y-6 pt-4">
                 {[
                   { t: 'Shared Dependencies', d: 'Managed centrally in root to save space and ensure consistency.', color: 'bg-indigo-500' },
                   { t: 'Serverless Compatible', d: 'Bridge-ready endpoints for easy scaling on Vercel or AWS Lambda.', color: 'bg-pink-500' },
                   { t: 'Type-Safe Contracts', d: 'Change your schema once, and see the errors in your UI instantly.', color: 'bg-emerald-500' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className={`w-1 shrink-0 ${item.color} rounded-full transition-all group-hover:w-2`}></div>
                      <div>
                        <h4 className="text-white font-black text-lg mb-1 tracking-tight">{item.t}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- Security Deep-Dive --- */}
        <section id="security" className="space-y-16 py-12 scroll-mt-20">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Security by <span className="bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent italic">Default.</span></h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">Protecting your users shouldn't be an afterthought.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { t: 'HttpOnly Cookies', d: 'Impervious to XSS attacks by keeping tokens outside JS reach.', ic: '🛡️' },
                { t: 'Bcrypt Hashing', d: 'Salted cryptographic hashes for all user passwords.', ic: '🔐' },
                { t: 'Rate Limiting', d: 'Production-ready protection against brute-force attempts.', ic: '⏲️' },
                { t: 'Security Headers', d: 'X-Frame-Options, CSP, and other headers to harden your app.', ic: '🔒' },
              ].map((s, i) => (
                <div key={i} className="p-8 rounded-3xl md:rounded-[40px] bg-white/2 border border-white/5 hover:bg-white/5 transition-colors group">
                   <div className="text-3xl mb-6 group-hover:scale-125 transition-transform">{s.ic}</div>
                   <h4 className="text-lg font-bold text-white mb-2">{s.t}</h4>
                   <p className="text-slate-500 text-xs leading-relaxed">{s.d}</p>
                </div>
              ))}
           </div>
        </section>

        {/* --- Storage & Deployment (Revised) --- */}
        <section id="storage" className="relative py-24 rounded-3xl md:rounded-[60px] border border-white/10 bg-linear-to-br from-indigo-500/3 to-slate-950 overflow-hidden px-8 md:px-16 scroll-mt-20">
           <div className="absolute right-[5%] top-[10%] w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute left-[10%] bottom-[10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
              <div className="space-y-8">
                 <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight italic">
                    Universal <br/><span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Storage Layer.</span>
                 </h2>
                 <p className="text-slate-400 text-lg leading-relaxed">
                    A vendor-agnostic system that allows you to swap storage providers without touching your frontend or business logic. 
                 </p>
                 <div className="flex flex-wrap gap-3">
                    {['Local', 'Cloudinary', 'AWS S3', 'R2', 'D.Ocean', 'Railway'].map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-2xl bg-white/5 text-slate-400 text-xs font-mono font-bold border border-white/5">{tag}</span>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div className="p-10 rounded-3xl md:rounded-[45px] bg-black/40 border border-white/5 backdrop-blur-md space-y-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-pink-500/5 transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
                    <div className="flex justify-between items-center relative z-10">
                       <h4 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Cloud Deployment</h4>
                       <span className="p-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></span>
                    </div>
                    <div className="space-y-4 relative z-10 font-mono text-sm">
                       <p className="text-slate-400 flex items-center justify-between">Vercel Serverless <span className="text-slate-600">PRODUCTION</span></p>
                       <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-linear-to-r from-emerald-500 to-indigo-500 h-full w-full"></div>
                       </div>
                       <p className="text-slate-400 flex items-center justify-between">Docker / PM2 <span className="text-slate-600">SUPPORTED</span></p>
                       <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-slate-700 h-full w-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- Environment Variables Guide --- */}
        <section id="config" className="space-y-12 scroll-mt-20">
           <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Configuration <span className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Matrix</span></h2>
              <p className="text-slate-500 font-medium py-4 max-w-lg mx-auto">Key environment variables required to run your production instances.</p>
           </div>
           
           <div className="overflow-x-auto rounded-3xl md:rounded-[40px] border border-white/5 bg-slate-900/40 backdrop-blur-sm">
              <table className="w-full text-left text-sm border-collapse">
                 <thead>
                    <tr className="border-b border-white/10">
                       <th className="p-6 text-slate-400 uppercase font-black tracking-widest text-[10px]">Variable</th>
                       <th className="p-6 text-slate-400 uppercase font-black tracking-widest text-[10px]">Status</th>
                       <th className="p-6 text-slate-400 uppercase font-black tracking-widest text-[10px]">Description</th>
                    </tr>
                 </thead>
                 <tbody className="text-slate-300">
                    {[
                      { v: 'DB_HOST', s: 'Required', d: 'MySQL Server Host Address (localhost/remote)' },
                      { v: 'JWT_SECRET', s: 'Required', d: 'Cryptographic secret for Access Tokens (32+ chars)' },
                      { v: 'STORAGE_PROVIDER', s: 'Optional', d: 'local, cloudinary, or s3' },
                      { v: 'CORS_ORIGIN', s: 'Production', d: 'Frontend domain allowed to access the API' },
                    ].map((row, i) => (
                      <tr key={i} className="group hover:bg-white/2 border-b border-white/5 transition-colors">
                         <td className="p-6 border-r border-white/5 font-mono text-indigo-400 font-bold">{row.v}</td>
                         <td className="p-6 border-r border-white/5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tighter ${row.s === 'Required' ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-500/20 text-slate-400'}`}>
                               {row.s}
                            </span>
                         </td>
                         <td className="p-6 text-slate-500 italic text-xs">{row.d}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        {/* --- Application Samples Preview --- */}
        <section id="samples" className="space-y-24 py-12 scroll-mt-20">
           <div className="text-center space-y-4">
              <span className="text-pink-500 font-black tracking-widest text-xs uppercase px-3 py-1 bg-pink-500/10 rounded-lg">Real-world Ready</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Pre-built <span className="bg-linear-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent italic">Application</span> Samples.</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">Production-grade features implemented with modern best practices.</p>
           </div>
           
           <div className="space-y-32">
              {/* Login Flow */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8 order-2 lg:order-1">
                    <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Secure <br/>Authentication Flow</h3>
                       <p className="text-slate-400 text-lg leading-relaxed font-medium">
                          A complete JWT-based authentication system using HttpOnly cookies to prevent XSS. 
                          Features secure login, token refreshing, and automatic session cleanup.
                       </p>
                    </div>
                    <ul className="space-y-3">
                       {['CSRF Protection', 'JWT Refresh Strategy', 'Device-bound Sessions'].map(item => (
                          <li key={item} className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>
                 
                 <div className="relative group order-1 lg:order-2">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] group-hover:bg-indigo-500/30 transition-all rounded-full scale-75"></div>
                    <div className="relative p-8 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl space-y-6 max-w-sm mx-auto transform hover:-rotate-2 transition-transform duration-500">
                       <div className="text-center space-y-2 mb-4">
                          <div className="w-12 h-12 bg-indigo-500/10 rounded-full mx-auto flex items-center justify-center text-indigo-400 font-black italic">B</div>
                          <p className="text-white font-black text-lg">Sign In</p>
                       </div>
                       <div className="space-y-4">
                          <div className="h-10 bg-slate-900 border border-slate-700 rounded-lg w-full flex items-center px-3">
                             <div className="h-2 w-24 bg-slate-700 rounded-full"></div>
                          </div>
                          <div className="h-10 bg-slate-900 border border-slate-700 rounded-lg w-full flex items-center px-3">
                             <div className="h-2 w-16 bg-slate-700 rounded-full"></div>
                          </div>
                          <div className="h-12 bg-indigo-600 rounded-lg w-full flex items-center justify-center">
                             <div className="h-2 w-20 bg-white/50 rounded-full"></div>
                          </div>
                       </div>
                       <div className="pt-4 flex justify-center">
                          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] uppercase font-black tracking-widest text-slate-500">Secured with Cookies</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Register Flow */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="relative group lg:order-1">
                    <div className="absolute inset-0 bg-pink-500/20 blur-[100px] group-hover:bg-pink-500/30 transition-all rounded-full scale-75"></div>
                    <div className="relative p-8 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl space-y-6 max-w-sm mx-auto transform hover:rotate-2 transition-transform duration-500">
                       <div className="text-center space-y-1 mb-2">
                          <p className="text-white font-black text-lg">Create Account</p>
                          <p className="text-slate-500 text-xs">Join the ecosystem</p>
                       </div>
                       <div className="space-y-4">
                          <div className="h-10 bg-slate-900 border border-slate-700 rounded-lg w-full flex items-center px-3">
                             <div className="h-2 w-28 bg-slate-700 rounded-full"></div>
                          </div>
                          <div className="h-10 bg-slate-900 border border-slate-700 rounded-lg w-full flex items-center px-3">
                             <div className="h-2 w-12 bg-slate-700 rounded-full"></div>
                          </div>
                          <div className="space-y-2">
                             <div className="h-10 bg-slate-900 border border-slate-700 rounded-lg w-full flex items-center px-3">
                                <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
                             </div>
                             <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden px-1">
                                <div className="h-full flex-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <div className="h-full flex-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <div className="h-full flex-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <div className="h-full flex-1 bg-slate-700"></div>
                             </div>
                             <p className="text-[10px] text-emerald-400 text-right font-black uppercase tracking-tighter">Strong Password</p>
                          </div>
                          <div className="h-12 bg-pink-600 rounded-lg w-full flex items-center justify-center mt-2">
                             <div className="h-2 w-16 bg-white/50 rounded-full"></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-8 lg:order-2">
                    <div className="inline-flex p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Advanced <br/>Registration Logic</h3>
                       <p className="text-slate-400 text-lg leading-relaxed font-medium">
                          Multi-stage registration with built-in real-time validation and Bcrypt cryptographic hashing for industrial-grade password security.
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                          { l: 'Strength Meter', ic: '📊' },
                          { l: 'Bcrypt Hash', ic: '🔐' },
                          { l: 'Email Validation', ic: '📧' },
                          { l: 'Auto-Login', ic: '🚀' },
                       ].map(item => (
                          <div key={item.l} className="flex items-center gap-2 p-3 rounded-xl bg-white/2 border border-white/5">
                             <span className="text-base">{item.ic}</span>
                             <span className="text-slate-500 font-bold text-xs uppercase tracking-tight">{item.l}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Profile Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8 order-2 lg:order-1">
                    <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Dynamic Profile <br/>& Image Processing</h3>
                       <p className="text-slate-400 text-lg leading-relaxed font-medium">
                          Comprehensive user dashboard featuring inline editing, atomic data updates, and an advanced image cropping system compatible with S3 and Cloudinary.
                       </p>
                    </div>
                    <div className="space-y-4">
                       {[
                          { t: 'Multi-Cloud Upload', d: 'Supports Local, S3, R2, and Cloudinary out-of-the-box.' },
                          { t: 'Interactive Cropping', d: 'Precise client-side image manipulation using react-easy-crop.' },
                       ].map((item, i) => (
                          <div key={i} className="space-y-1">
                             <h4 className="text-white font-bold text-sm tracking-tight">{item.t}</h4>
                             <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.d}</p>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="relative group order-1 lg:order-2">
                    <div className="absolute inset-x-0 top-0 h-40 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all rounded-full"></div>
                    <div className="relative p-6 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl space-y-8 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 p-1">
                             <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative overflow-hidden">
                                <span className="text-white font-black text-xl">LX</span>
                                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-black/40 backdrop-blur-md flex items-center justify-center text-[8px] font-black uppercase text-white/80">Edit</div>
                             </div>
                          </div>
                          <div className="space-y-2 flex-1">
                             <div className="h-3 bg-slate-700 rounded-full w-3/4"></div>
                             <div className="h-2 bg-slate-900 rounded-full w-1/2"></div>
                          </div>
                       </div>
                       <div className="space-y-4 pt-4">
                          <div className="py-4 border-t border-slate-700/50 space-y-3">
                             <div className="flex justify-between items-center">
                                <div className="h-2 w-20 bg-slate-700 rounded-full"></div>
                                <div className="h-5 w-12 bg-indigo-500/10 border border-indigo-500/20 rounded-md"></div>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
                                <div className="h-5 w-12 bg-indigo-500/10 border border-indigo-500/20 rounded-md"></div>
                             </div>
                          </div>
                          <div className="h-10 bg-red-500/10 border border-red-500/20 rounded-lg w-full flex items-center justify-center">
                             <div className="h-2 w-16 bg-red-500/50 rounded-full"></div>
                          </div>
                       </div>
                       <div className="absolute top-0 right-0 p-4">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-24 relative overflow-hidden rounded-3xl md:rounded-[70px] border border-white/10 bg-slate-900/50 backdrop-blur-2xl text-center shadow-2xl">
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-pink-500/10 to-transparent -z-10 animate-pulse"></div>
           <div className="space-y-10 relative z-10 px-6 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">Ready to <span className="bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent italic">Deploy.</span></h2>
              <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                 The most robust starting point for your next large-scale venture. 
                 Optimized, Secure, and Blazing Fast.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                 {isAuthenticated ? (
                    <Link to="/profile" className="px-16 py-6 bg-white text-black font-black rounded-3xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/20 text-lg">
                       Go to Dashboard
                    </Link>
                 ) : (
                    <Link to="/login" className="px-16 py-6 bg-pink-600 text-white font-black rounded-3xl hover:bg-pink-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-pink-500/30 text-lg">
                       Sign In to Dashboard
                    </Link>
                 )}
              </div>
              <div className="flex items-center justify-center gap-8 pt-4 opacity-40">
                 <Link to="/register" className="text-xs font-black uppercase tracking-widest text-white hover:opacity-100 transition-opacity">Create Free Account</Link>
                 <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                 <a href="https://github.com/luxorwannabe/bun-elysia-fullstack" target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-white hover:opacity-100 transition-opacity">GitHub Source</a>
              </div>
           </div>
        </section>

        {/* --- Footer Signature --- */}
        <footer className="relative mt-8 pt-8 pb-12 flex flex-col items-center gap-10 text-center overflow-hidden">
           {/* Background Decorative Text */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10">
              <span className="text-[12vw] font-black text-white/3 tracking-[2em] translate-x-[1em] whitespace-nowrap uppercase">BUN ELYSIA</span>
           </div>
           
           <div className="flex flex-col items-center gap-8 relative z-10 transition-all duration-700">
              <div className="group relative">
                 <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-violet-500 to-indigo-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-pink-500 via-violet-500 to-indigo-500 p-px shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500">
                       <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-white font-black text-2xl italic tracking-tighter">B</div>
                    </div>
                    <div className="flex flex-col items-start translate-y-1">
                       <span className="font-black tracking-tighter text-3xl text-white leading-none">BUN ELYSIA</span>
                       <span className="text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase pl-1 opacity-70">Fullstack Monorepo</span>
                    </div>
                 </div>
              </div>
              
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
                 A high-performance monorepo boilerplate built for rapid fullstack development. 
                 Handcrafted with <span className="text-pink-500">♥</span> by <a href="https://github.com/luxorwannabe" className="text-indigo-400 hover:underline">Luxor</a>.
              </p>
           </div>
           
           <div className="space-y-6 text-center relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                 {['Bun', 'Elysia', 'Drizzle', 'React', 'Eden'].map(t => (
                   <span key={t} className="text-[10px] font-black tracking-widest text-white uppercase border border-white/10 bg-white/5 px-4 py-1.5 rounded-full hover:border-white/30 transition-colors">{t}</span>
                 ))}
              </div>

           </div>
        </footer>

      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`hidden md:flex fixed bottom-8 right-8 p-4 rounded-full cursor-pointer bg-white/10 border border-white/10 backdrop-blur-xl text-white shadow-2xl transition-all duration-500 hover:bg-white/20 hover:scale-110 active:scale-95 z-50 group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform"><path d="m18 15-6-6-6 6"/></svg>
      </button>
    </div>
  )
}
