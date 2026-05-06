import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserCompanions } from "@/lib/actions/companion.actions";
import { HoverDevCard } from "@/components/ui/hover-dev-card";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="h-[80vh] w-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-6xl font-bold text-primary mb-4">Quiz</h2>
        <p className="text-lg">Please sign in to view your quizzes.</p>
        <Link href="/sign-in" className="btn-primary mt-6">Sign In</Link>
      </main>
    );
  }

  const companions = await getUserCompanions(userId);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative reveal-section">
      <section className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-white/5 pb-10 gap-6">
        <h1 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash">Quizzes</h1>
        <Link href="/companion/new" className="text-[10px] uppercase tracking-[4px] opacity-40 hover:opacity-100 hover:text-magenta transition-all font-bold">
          CREATE_NEW_ENTITY
        </Link>
      </section>

      {(!companions || companions.length === 0) ? (
        <div className="border border-white/5 bg-surface-container p-20 text-center relative overflow-hidden group img-box-texture">
          <div className="absolute top-0 left-0 w-1 h-12 bg-magenta"></div>
          <p className="text-[11px] uppercase tracking-[3px] font-black opacity-40 mb-2">ARCHIVE_EMPTY // 404</p>
          <p className="text-[10px] uppercase tracking-[2px] opacity-20">Create a companion to unlock its neural quiz here.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {companions.map((c: any) => (
            <div key={c.id} className="group border border-white/5 bg-surface-container p-10 flex flex-col justify-between transition-all duration-500 hover:border-magenta shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[8px] uppercase tracking-[2px] opacity-10 font-black italic">NODE // {c.id.slice(0,8)}</div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white group-hover:text-magenta transition-colors">{c.name}</h2>
                  <span className="text-[9px] uppercase tracking-[3px] font-black py-1 px-3 border border-white/10 bg-white/5 opacity-60">
                    {c.subject}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-[2px] leading-relaxed opacity-40 font-bold line-clamp-2">
                  <span className="text-magenta mr-2">/</span> {c.topic}
                </p>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center">
                <Link href={`/quiz/${c.id}`} className="text-[10px] uppercase tracking-[3px] font-black hover:text-magenta transition-all border-b border-transparent hover:border-magenta pb-1">
                  Initialize Quiz
                </Link>
                <div className="text-[9px] uppercase tracking-[2px] opacity-20 font-black italic">
                  EST_LOAD // {c.duration}M
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
