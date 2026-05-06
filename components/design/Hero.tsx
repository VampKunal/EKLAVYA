"use client";
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-title span', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out'
    })
    .from('.accent-bar', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1,
      ease: 'power2.inOut'
    }, '-=0.5')
    .from('.hero-content-text > *', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-visual', {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1');

    // Parallax for image
    gsap.to(imageRef.current, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-20 mb-24 relative z-10 lg:pl-10">
      {/* Hero Text Content */}
      <div className="col-span-1 md:col-span-12 lg:col-span-7 flex flex-col justify-center relative hero-content">
        <div className="hero-title relative z-10">
          <h1 className="massive-text">
            <span className="block italic">BEYOND</span>
            <span className="block outline-text">NEURAL</span>
          </h1>
          <div className="accent-bar mt-8 md:mt-12"></div>
        </div>
        
        <div className="mt-10 md:mt-16 max-w-lg hero-content-text">
          <p className="text-xs md:text-sm uppercase tracking-[4px] leading-relaxed opacity-60 font-bold">
            <span className="text-magenta">[ Phase_Initialize ]</span> // Constructing the next evolution of cognitive architecture. All nodes linked.
          </p>
          <div className="mt-10 md:mt-12 flex flex-wrap gap-6 md:gap-10">
            <button className="bg-magenta text-white px-8 py-4 text-[11px] uppercase tracking-[3px] font-black hover:bg-white hover:text-black transition-all">
              Launch Protocol
            </button>
            <button className="text-[11px] uppercase tracking-[3px] font-black opacity-40 hover:opacity-100 transition-all border-b border-white/20 hover:border-magenta pb-1">
              Access Files
            </button>
          </div>
        </div>
      </div>

      {/* Hero Visual Side */}
      <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col gap-8 md:gap-10 hero-visual">
        <div className="aspect-[4/5] bg-surface-container border border-white/5 relative overflow-hidden group img-box-texture shadow-2xl">
          <img 
            ref={imageRef}
            className="absolute -top-20 left-0 w-full h-[120%] object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[3000ms]" 
            src="https://lh3.googleusercontent.com/aida/ADBb0ujSdDPfY4-1YtF8RhZwz2fPX_iGNyP8uHXwJ2PmawdVQ6vlS9CDy5Ym8ZPAiazzADiaXEU2j7HHpVHiCg9w13Y9TPUCPkfeG7Vr0MitmUed6gK71AIUkPuUmRd4DWQpa813_BMFc3vBpb0KkDqENB-WKGZevotKTfxIO2XeULWBes3IJi_CahBk5r2VMxf1MMESxPxeaJzNMVDg0FLAEyRSeidVMFwDJEFuRg9mh43MfUcpMOtLVBwrfnkIyt7KREYmVanh-j42jA"
            alt="Neural Evolution"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-10 left-10 text-[10px] uppercase tracking-[3px] font-black bg-black/80 px-4 py-2 border-l-2 border-magenta">
            Project_Arch.04 // STABLE
          </div>
        </div>
        
        <div className="p-8 md:p-12 border border-white/5 bg-surface-container-low grid grid-cols-2 gap-10 md:gap-12 backdrop-blur-sm">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[3px] opacity-40 font-bold">Cognitive Load</span>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-serif italic text-magenta">74.2%</span>
              <div className="h-px w-full bg-white/10 overflow-hidden">
                <div className="h-full bg-magenta w-[74.2%]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[3px] opacity-40 font-bold">Credits</span>
            <span className="text-3xl font-serif italic">1,240</span>
            <div className="h-px w-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
