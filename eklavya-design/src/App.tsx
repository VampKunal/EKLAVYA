/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './components/Header';
import Hero from './components/Hero';
import CompanionCard from './components/CompanionCard';
import SessionLogs from './components/SessionLogs';
import BottomGrid from './components/BottomGrid';
import Footer from './components/Footer';
import BackgroundDecoration from './components/BackgroundDecoration';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLightMode, setIsLightMode] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isLightMode]);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.reveal-section');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Parallax effect for Background Number
    gsap.to('.bg-number', {
      y: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    // Grain effect parallax
    gsap.to('.grain-overlay', {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }, { scope: mainRef });

  const companions = [
    {
      name: "Kunal Rai",
      field: "PHYSICS",
      description: "Quantum plant growth and bio-luminescent ecosystems research lead.",
      duration: "5",
      rating: "4.9",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwCQYRLAyvkeE4BF0JLcYg0A3MjRS_1F-uiSoyzqS2qDfiuHOF5VUzm7VDigecxSYIy-GInlkC4SMMYllk2xVv2h8-i9NnoT24BWRrCDYyGDSN8SdtBYEwYiKvk8bJPjC1lHtSJkpdLJ8KaSeekw3UlcjE9b-Vfz6ZTrDexhPnsKzdYAOCC1GtlAPwhHiM4C8KIY_EXEeLFjAiENs3Lih8Rlx5pNuO_QGXuipj0OsN-wTLfaM_qcVnRZCJ4RrXcnhhb3X6i3evxK4"
    },
    {
      name: "Kunal Rai",
      field: "BIOLOGY",
      description: "Synthetic neural mapping and organic-digital integration expert.",
      duration: "12",
      rating: "5.0",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj30GeMOyVJDbmObZCVFHrCU6eAeY12Kou5CsqUPS4Q14jBqYsBvFeEasHLaj2DzXRHjGiq-v6JGDBRf_vOwVc-FWnspcrgP6BNxBWsNzBYpDxUNKzlWIQL_TqMVHFhJBs5aUzB0oES4fWvSbbh3uH0bS5xJZLs14p744bjvkHsdOtOqGGc45uBqdU-ffS45qeSWf6E4noHWTvaFOvgDdA1flVv2bAEcr7uuwANIeNA77clVMpDkiVVIGOg0ei_hw4yFWCCZQcnof6"
    }
  ];

  return (
    <div ref={mainRef} className="min-h-screen flex flex-col relative selection:bg-magenta selection:text-white overflow-x-hidden">
      <div className="grain-overlay fixed inset-0 z-[100] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <BackgroundDecoration />
      <Header isLightMode={isLightMode} onToggleTheme={toggleTheme} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative">
        <section className="reveal-section">
          <Hero />
        </section>
        
        {/* Popular Companions Section */}
        <section className="mb-32 relative z-10 lg:pl-10 reveal-section">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-white/5 pb-10">
            <h2 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash">Collection</h2>
            <button className="text-[10px] uppercase tracking-[4px] opacity-40 hover:opacity-100 hover:text-magenta transition-all font-bold mt-6 md:mt-0">
              EXPLORE_ALL_ASSETS
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {companions.map((companion, index) => (
              <CompanionCard 
                key={index} 
                name={companion.name}
                field={companion.field}
                description={companion.description}
                duration={companion.duration}
                rating={companion.rating}
                image={companion.image}
              />
            ))}
          </div>
        </section>

        <div className="lg:pl-10">
          <section className="reveal-section">
            <SessionLogs />
          </section>
          <section className="reveal-section">
            <BottomGrid />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
