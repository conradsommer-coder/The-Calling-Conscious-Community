import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarsBackground() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.4)]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(1);
  const isTransitioning = useRef(false);
  const lastScrollTime = useRef(0);

  const changeSection = (dir: number) => {
    setCurrentSection((prev) => {
      const next = prev + dir;
      if (next >= 0 && next <= 3) {
        setDirection(dir);
        isTransitioning.current = true;
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000);
        return next;
      }
      return prev;
    });
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = new Date().getTime();
      if (now - lastScrollTime.current < 1000 || isTransitioning.current) return;

      const target = e.target as HTMLElement;
      const scrollable = target.closest(".slide-content");

      if (scrollable) {
        const isAtTop = scrollable.scrollTop <= 0;
        const isAtBottom =
          Math.abs(scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight) <= 1;

        if (e.deltaY > 0 && !isAtBottom) return;
        if (e.deltaY < 0 && !isAtTop) return;
      }

      if (Math.abs(e.deltaY) > 20) {
        changeSection(e.deltaY > 0 ? 1 : -1);
        lastScrollTime.current = now;
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastScrollTime.current < 1000 || isTransitioning.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      const target = e.target as HTMLElement;
      const scrollable = target.closest(".slide-content");

      if (scrollable) {
        const isAtTop = scrollable.scrollTop <= 0;
        const isAtBottom =
          Math.abs(scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight) <= 1;

        if (deltaY > 0 && !isAtBottom) return;
        if (deltaY < 0 && !isAtTop) return;
      }

      if (Math.abs(deltaY) > 50) {
        changeSection(deltaY > 0 ? 1 : -1);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "-100vw" : "100vw",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "100vw" : "-100vw",
      opacity: 0,
    }),
  };

  return (
    <div className="w-screen h-screen bg-brand-bg text-brand-ivory font-sans selection:bg-brand-sand selection:text-brand-bg overflow-hidden relative flex flex-col">
      {/* Image Background */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dr78wne7t/image/upload/v1782174505/ChatGPT_Image_Jun_22_2026_05_27_49_PM_3_swyoi8.png')` }}
      />
      <div className="absolute inset-0 z-0 bg-brand-bg/40 pointer-events-none" />
      <StarsBackground />

      {/* Global Persistent Nav */}
      <nav className="absolute top-0 left-0 right-0 p-8 lg:px-16 lg:py-12 flex justify-between items-center z-50 pointer-events-none">
        <h2 className="font-serif italic text-xl md:text-2xl tracking-[0.2em] uppercase text-brand-sand pointer-events-auto">
          The Calling
        </h2>
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-60">Est. 2024 — Conscious Community</div>
      </nav>

      {/* Main Slider Area */}
      <div className="flex-1 relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {currentSection === 0 && (
            <motion.div
              key="sec0"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 slide-content overflow-y-auto px-8 lg:px-16 pt-32 pb-12 flex flex-col"
            >
              <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-center">
                <div className="max-w-2xl">
                  <FadeIn delay={0.2}>
                    <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-serif leading-tight mb-8">
                      Union through <br className="hidden md:block" /> Presence
                    </h1>
                  </FadeIn>
                  <FadeIn delay={0.4}>
                    <p className="text-base md:text-lg opacity-80 leading-relaxed font-light mb-12 max-w-lg">
                      A gathering for those who feel a fire within — a space to connect, listen, share, and walk together with an open heart.
                    </p>
                  </FadeIn>
                  <FadeIn delay={0.6} className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 gap-6 sm:gap-0">
                    <button
                      onClick={() => changeSection(3)}
                      className="inline-flex items-center justify-center px-10 py-5 border border-brand-sand text-brand-sand uppercase tracking-widest text-xs hover:bg-brand-sand hover:text-brand-bg transition-colors duration-300 font-semibold cursor-pointer"
                    >
                      Answer The Calling
                    </button>
                    <span className="text-[10px] md:text-[11px] uppercase tracking-widest opacity-50">
                      One Heart. Many Gifts.<br className="sm:hidden" /> Infinite Possibilities.
                    </span>
                  </FadeIn>
                </div>
              </div>
            </motion.div>
          )}

          {currentSection === 1 && (
            <motion.div
              key="sec1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 slide-content overflow-y-auto px-8 lg:px-16 pt-32 pb-12 flex flex-col"
            >
              <div className="max-w-6xl w-full mx-auto my-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                  <div className="lg:col-span-4 lg:pr-8 border-b lg:border-b-0 pb-8 lg:pb-0 lg:border-r border-brand-sand/20">
                    <FadeIn delay={0.2}>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-brand-sand mb-6 font-semibold">A Space Rooted in the Heart</h3>
                      <p className="text-sm opacity-70 leading-relaxed font-light mb-4">
                        THE CALLING is a space where we come together not because one person has all the answers, but because each of us carries wisdom. We believe every individual holds a unique gift to share, and a perspective that may illuminate another’s path.
                      </p>
                      <p className="text-sm opacity-70 leading-relaxed font-light">
                        Rooted in presence, compassion, and authentic connection, we honor every voice. Here, listening is just as powerful as speaking, and being is just as vital as doing.
                      </p>
                    </FadeIn>
                  </div>
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <FadeIn delay={0.4}>
                      <div className="group p-6 h-full border border-brand-sand/10 bg-white/5 hover:bg-brand-sand hover:border-brand-sand flex flex-col transition-all duration-500 hover:-translate-y-2 cursor-default">
                        <div className="text-brand-sand group-hover:text-brand-bg font-serif italic text-xl mb-3 transition-colors duration-500">01. Presence</div>
                        <p className="text-xs opacity-60 group-hover:opacity-90 group-hover:text-brand-bg leading-normal font-light transition-all duration-500">
                          A space to slow down, listen deeply, and reconnect with what is alive within.
                        </p>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.5}>
                      <div className="group p-6 h-full border border-brand-sand/10 bg-white/5 hover:bg-brand-sand hover:border-brand-sand flex flex-col transition-all duration-500 hover:-translate-y-2 cursor-default">
                        <div className="text-brand-sand group-hover:text-brand-bg font-serif italic text-xl mb-3 transition-colors duration-500">02. Connection</div>
                        <p className="text-xs opacity-60 group-hover:opacity-90 group-hover:text-brand-bg leading-normal font-light transition-all duration-500">
                          A gathering where we support, empower, and witness one another with respect and love.
                        </p>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                      <div className="group p-6 h-full border border-brand-sand/10 bg-white/5 hover:bg-brand-sand hover:border-brand-sand flex flex-col transition-all duration-500 hover:-translate-y-2 cursor-default">
                        <div className="text-brand-sand group-hover:text-brand-bg font-serif italic text-xl mb-3 transition-colors duration-500">03. Shared Wisdom</div>
                        <p className="text-xs opacity-60 group-hover:opacity-90 group-hover:text-brand-bg leading-normal font-light transition-all duration-500">
                          A place where teaching and listening become part of the same path.
                        </p>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentSection === 2 && (
            <motion.div
              key="sec2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 slide-content overflow-y-auto px-8 lg:px-16 pt-32 pb-12 flex flex-col"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="text-brand-sand" strokeWidth="0.5" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" className="text-brand-sand" strokeWidth="0.5" />
                  <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" className="text-brand-sand" strokeWidth="0.5" />
                  <path d="M100 10 L100 190 M10 100 L190 100" stroke="currentColor" className="text-brand-sand" strokeWidth="0.5" />
                  <path d="M36.36 36.36 L163.64 163.64 M36.36 163.64 L163.64 36.36" stroke="currentColor" className="text-brand-sand" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="max-w-6xl w-full mx-auto my-auto py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
                <div className="lg:col-span-5 text-left">
                  <FadeIn delay={0.2}>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-brand-sand mb-8 font-semibold relative inline-block">
                      <span className="hidden md:block absolute -left-12 top-1/2 w-8 h-[1px] bg-brand-sand/50"></span>
                      The Inquiry
                    </h3>
                  </FadeIn>
                  <FadeIn delay={0.4}>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-5xl text-brand-ivory leading-tight mb-8">
                      Not answers,<br />
                      <span className="italic text-brand-sand">but questions.</span>
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.6}>
                    <p className="text-sm md:text-base opacity-70 leading-relaxed font-light mb-8">
                      Questions that invite us to look deeper within ourselves, beyond what we know, and into what is ready to emerge.
                    </p>
                  </FadeIn>
                </div>
                
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <FadeIn delay={0.8}>
                    <div className="group p-8 border border-brand-sand/10 bg-white/5 hover:bg-brand-sand hover:border-brand-sand transition-all duration-500 text-left relative cursor-default hover:-translate-y-1">
                      <p className="text-xl md:text-2xl font-serif italic text-brand-ivory/90 group-hover:text-brand-bg transition-colors duration-500">
                        "What is life calling us into?"
                      </p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={1.0}>
                    <div className="group p-8 border border-brand-sand/10 bg-white/5 hover:bg-brand-sand hover:border-brand-sand transition-all duration-500 text-left relative cursor-default hover:-translate-y-1">
                      <p className="text-xl md:text-2xl font-serif italic text-brand-ivory/90 group-hover:text-brand-bg transition-colors duration-500">
                        "What are we here to create together?"
                      </p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={1.2}>
                    <div className="group p-8 border border-brand-sand/10 bg-white/5 hover:bg-brand-sand hover:border-brand-sand transition-all duration-500 text-left relative cursor-default hover:-translate-y-1">
                      <p className="text-xl md:text-2xl font-serif italic text-brand-ivory/90 group-hover:text-brand-bg transition-colors duration-500">
                        "How can we support one another while living with more presence, connection, and alignment?"
                      </p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </motion.div>
          )}

          {currentSection === 3 && (
            <motion.div
              key="sec3"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 slide-content overflow-y-auto px-8 lg:px-16 pt-32 pb-12 flex flex-col"
            >
              <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end flex-1 mb-16 mt-auto">
                  <div className="lg:col-span-7">
                    <FadeIn delay={0.2}>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-brand-sand mb-8 font-semibold">If You Feel The Calling</h3>
                      <p className="text-base md:text-lg opacity-70 mb-0 max-w-md italic font-light leading-relaxed">
                        "This is an invitation to those who are curious, seeking, remembering, and ready to contribute. If something inside you resonates with these words, trust that feeling."
                      </p>
                    </FadeIn>
                  </div>
                  <div className="lg:col-span-5">
                    <FadeIn delay={0.4}>
                      <form className="grid grid-cols-1 sm:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          placeholder="NAME" aria-label="Name"
                          className="bg-transparent border-b border-brand-sand/30 py-4 text-[11px] tracking-widest focus:outline-none focus:border-brand-sand placeholder:opacity-40 uppercase transition-colors"
                        />
                        <input
                          type="email"
                          placeholder="EMAIL" aria-label="Email"
                          className="bg-transparent border-b border-brand-sand/30 py-4 text-[11px] tracking-widest focus:outline-none focus:border-brand-sand placeholder:opacity-40 uppercase transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="MESSAGE" aria-label="Message"
                          className="sm:col-span-2 bg-transparent border-b border-brand-sand/30 py-4 text-[11px] tracking-widest focus:outline-none focus:border-brand-sand placeholder:opacity-40 uppercase mb-4 transition-colors"
                        />
                        <button type="submit" className="sm:col-span-2 text-[11px] uppercase tracking-[0.4em] text-brand-sand hover:opacity-70 text-left transition-opacity font-semibold py-4">
                          Send Message &rarr;
                        </button>
                      </form>
                    </FadeIn>
                  </div>
                </div>

                <div className="pt-12 border-t border-brand-sand/10 flex flex-col md:flex-row justify-between items-center gap-6 mt-16">
                  <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 text-center md:text-left">
                    The Calling — Union Through Presence © {new Date().getFullYear()}
                  </div>
                  <div className="flex space-x-6">
                    <a href="#" className="text-[9px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">Instagram</a>
                    <a href="#" className="text-[9px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">Journal</a>
                    <a href="#" className="text-[9px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">Community</a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Scroll Indicators */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 pointer-events-none">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className={`w-1 transition-all duration-500 rounded-full bg-brand-sand ${currentSection === idx ? 'h-8 opacity-100' : 'h-2 opacity-30'}`} />
        ))}
      </div>
    </div>
  );
}

