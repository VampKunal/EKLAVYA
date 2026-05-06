"use client";
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function BackgroundDecoration() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Floating dots animation
    gsap.to('.bg-dot', {
      y: 'random(-50, 50)',
      x: 'random(-50, 50)',
      duration: 'random(3, 10)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        amount: 2,
        from: 'random'
      }
    });

    // Vertical line reveal
    gsap.from('.bg-line-v', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 2,
      stagger: 0.5,
      ease: 'power4.inOut'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Sidebar Simulation Nav - Large screens only */}
      <div className="hidden xl:flex absolute left-0 top-0 bottom-0 w-20 border-r border-white/5 flex-col items-center py-12 justify-between bg-background/50 backdrop-blur-sm">
        <div className="w-8 h-8 border-2 border-white flex items-center justify-center font-bold text-sm tracking-tighter">M</div>
        <div className="sidebar-vertical-label font-bold">PROTOCOL — 2026.04</div>
        <div className="w-8 h-8 border-2 border-magenta rounded-full flex items-center justify-center text-[10px] text-magenta font-black">●</div>
      </div>
      
      {/* Background Number */}
      <motion.div 
        style={{ y: y1 }}
        className="bg-number top-40 left-10 md:left-40 opacity-[0.03] lg:opacity-[0.04]"
      >
        04
      </motion.div>

      {/* Floating typographic accent */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 right-10 md:right-20 text-[10vw] font-black uppercase tracking-[-0.05em] text-white/[0.015] italic select-none"
      >
        Neural_Sync
      </motion.div>

      {/* Grid Lines */}
      <div className="bg-line-v absolute left-1/4 top-0 bottom-0 w-px bg-white opacity-[0.02]" />
      <div className="bg-line-v absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-[0.03]" />
      <div className="bg-line-v absolute left-3/4 top-0 bottom-0 w-px bg-white opacity-[0.02]" />
      <div className="absolute left-0 right-0 top-1/3 h-px bg-white opacity-[0.02]" />
      <div className="absolute left-0 right-0 top-2/3 h-px bg-white opacity-[0.02]" />

      {/* Floating Dots */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="bg-dot absolute w-1 h-1 bg-magenta opacity-20 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Scanline pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
    </div>
  );
}
