"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import SourceUploader from "@/components/companion/SourceUploader";
import CompanionComponent from "@/components/companion/CompanionComponent";
import { getSubjectColor } from "@/lib/utils";
import { getCompanion } from "@/lib/actions/companion.actions";

const CompanionSession = () => {
  const router = useRouter();
  const params = useParams(); // <-- use useParams hook here
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();

  const [companion, setCompanion] = useState<Companion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const fetchCompanion = async () => {
      try {
        const id = params.id as string;
        const data = await getCompanion(id);

        if (!data?.name) {
          router.push("/companion");
        } else {
          setCompanion(data);
        }
      } catch (error) {
        console.error(error);
        router.push("/companion");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanion();
  }, [params, user, isLoaded, router]);

  if (loading || !companion) {
    return <p className="p-4 text-lg">Loading companion session...</p>;
  }

  const { name, subject, topic, duration } = companion;
  const initialReview = searchParams.get('review') || undefined;

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative reveal-section">
      <article className="border border-white/10 bg-surface-container p-8 md:p-10 mb-10 flex justify-between items-center relative overflow-hidden group img-box-texture shadow-2xl">
        <div className="flex items-center gap-8 md:gap-12 relative z-10">
          <div
            className="size-20 md:size-24 flex items-center justify-center border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-700 bg-black/40"
            style={{ borderLeftWidth: '4px', borderLeftColor: getSubjectColor(subject) || 'var(--color-magenta)' }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={40}
              height={40}
              className="opacity-60 group-hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white group-hover:text-magenta transition-colors">
                {name}
              </h1>
              <span className="text-[10px] uppercase tracking-[3px] font-black py-1 px-3 border border-white/10 bg-white/5 opacity-60">
                {subject}
              </span>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-[2px] opacity-40 font-bold max-w-2xl leading-relaxed">
              <span className="text-magenta mr-3 font-black">/</span> {topic}
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-col items-end gap-2 relative z-10">
          <div className="text-[10px] uppercase tracking-[4px] opacity-30 font-bold">SESSION_DURATION</div>
          <div className="text-3xl font-serif italic text-white/80">{duration} <span className="text-sm uppercase tracking-widest opacity-40 not-italic ml-1">MINS</span></div>
        </div>

        {/* Decorative background number */}
        <div className="absolute right-[-20px] top-[-40px] text-[150px] font-black text-white/[0.02] pointer-events-none select-none">
          01
        </div>
      </article>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Pane: Sources (NotebookLM style) */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 border border-white/5 bg-surface-container-low backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-12 bg-magenta"></div>
            <h2 className="text-xs uppercase tracking-[4px] font-black mb-6 flex items-center gap-3">
              <span className="text-magenta">01</span> Notebook_Guide
            </h2>
            <p className="text-[11px] uppercase tracking-[2px] leading-relaxed opacity-40 font-medium">
              Initialize cognitive sync by uploading training data. Sources provide the neural weights for personalized tutoring.
            </p>
          </div>
          
          <div className="glass-morphism p-1">
            <SourceUploader companionId={params.id as string} />
          </div>
        </div>

        {/* Right Pane: Companion Chat */}
        <div className="lg:col-span-8 border border-white/5 bg-surface-container relative shadow-2xl flex flex-col min-h-[600px]">
          <div className="absolute top-0 right-0 p-4 text-[9px] uppercase tracking-[2px] opacity-20 font-black italic z-20">
            CONNECTION // ENCRYPTED
          </div>
          <CompanionComponent
            {...companion}
            companionId={params.id as string}
            userName={user?.firstName || "User"}
            userImage={user?.imageUrl || ""}
            initialUserMessage={initialReview}
          />
        </div>
      </div>
    </main>
  );
};

export default CompanionSession;
