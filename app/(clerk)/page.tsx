import CompanionCard from "@/components/companion/CompanionCard";
import CompanionsList from "@/components/companion/CompanionsList";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";
import Hero from "@/components/design/Hero";
import SessionLogs from "@/components/design/SessionLogs";
import BottomGrid from "@/components/design/BottomGrid";

const Page = async () => {
    const companions = await getAllCompanions({ limit: 4 });
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative">
        <section className="reveal-section">
          <Hero />
        </section>

        <section className="mb-32 relative z-10 lg:pl-10 reveal-section">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-white/5 pb-10">
            <h2 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash">Collection</h2>
            <button className="text-[10px] uppercase tracking-[4px] opacity-40 hover:opacity-100 hover:text-magenta transition-all font-bold mt-6 md:mt-0">
              EXPLORE_ALL_ASSETS
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {companions.map((companion) => (
                <CompanionCard
                    key={companion.id}
                    {...companion}
                    color={getSubjectColor(companion.subject)}
                />
            ))}
          </div>
        </section>

        <div className="lg:pl-10">
          <section className="reveal-section">
            <SessionLogs />
          </section>
          
          <section className="reveal-section mt-32">
            <h2 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash mb-16">History</h2>
            <CompanionsList
                title="Recently completed sessions"
                companions={recentSessionsCompanions}
                classNames="w-full"
            />
          </section>

          <section className="reveal-section">
            <BottomGrid />
          </section>
        </div>
    </main>
  )
}

export default Page