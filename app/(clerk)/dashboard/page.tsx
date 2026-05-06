import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/companion/CompanionsList";
import { CheckCircle2Icon, GraduationCapIcon, LayoutDashboardIcon, StarIcon, HistoryIcon, UserCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = (await getUserCompanions(user.id)) || [];
  const sessionHistory = (await getUserSessions(user.id)) || [];
  const bookmarkedCompanions = (await getBookmarkedCompanions(user.id)) || [];

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative reveal-section">
      {/* Welcome Header Section */}
      <section className="border border-white/10 bg-surface-container p-10 mb-16 relative overflow-hidden group img-box-texture shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between gap-12 items-center relative z-10">
          <div className="flex gap-10 items-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-magenta blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <Image
                src={user.imageUrl}
                alt={user.firstName!}
                width={120}
                height={120}
                className="relative border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-700 object-cover size-28 md:size-32"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter italic text-white">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-[10px] uppercase tracking-[4px] opacity-40 font-black flex items-center gap-3">
                <span className="text-magenta">[ Auth_Success ]</span> // {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>

          <div className="flex gap-6 w-full md:w-auto">
            <StatCard 
              icon={<CheckCircle2Icon className="text-magenta" size={16} />} 
              value={sessionHistory.length} 
              label="Lessons_Sync" 
            />
            <StatCard 
              icon={<GraduationCapIcon className="text-white" size={16} />} 
              value={companions.length} 
              label="Nodes_Active" 
            />
          </div>
        </div>
        
        {/* Decorative background number */}
        <div className="absolute right-[-20px] top-[-40px] text-[200px] font-black text-white/[0.02] pointer-events-none select-none">
          01
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="space-y-12 lg:pl-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="accent-bar w-12"></div>
          <h2 className="text-xs uppercase tracking-[4px] font-black opacity-40">Cognitive_Network</h2>
        </div>

        <Accordion type="multiple" defaultValue={['recent', 'bookmarks']} className="space-y-8">
          <AccordionItem value="recent" className="border border-white/5 bg-surface-container-low backdrop-blur-sm overflow-hidden shadow-xl px-8">
            <AccordionTrigger className="hover:no-underline py-10 group">
              <div className="flex items-center gap-6">
                <div className="p-3 border border-white/10 bg-white/5 group-hover:border-magenta transition-colors">
                  <HistoryIcon className="size-5 text-white/40 group-hover:text-magenta transition-colors" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white group-hover:text-magenta transition-colors">Recent Sessions</span>
                  <span className="text-[9px] uppercase tracking-[3px] font-black opacity-20">{sessionHistory.length} // TRACES_FOUND</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-10">
              <CompanionsList
                title=""
                companions={sessionHistory}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bookmarks" className="border border-white/5 bg-surface-container-low backdrop-blur-sm overflow-hidden shadow-xl px-8">
            <AccordionTrigger className="hover:no-underline py-10 group">
              <div className="flex items-center gap-6">
                <div className="p-3 border border-white/10 bg-white/5 group-hover:border-magenta transition-colors">
                  <StarIcon className="size-5 text-white/40 group-hover:text-magenta transition-colors" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white group-hover:text-magenta transition-colors">Bookmarks</span>
                  <span className="text-[9px] uppercase tracking-[3px] font-black opacity-20">{bookmarkedCompanions.length} // PINNED_NODES</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-10">
              <CompanionsList
                companions={bookmarkedCompanions}
                title=""
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="companions" className="border border-white/5 bg-surface-container-low backdrop-blur-sm overflow-hidden shadow-xl px-8">
            <AccordionTrigger className="hover:no-underline py-10 group">
              <div className="flex items-center gap-6">
                <div className="p-3 border border-white/10 bg-white/5 group-hover:border-magenta transition-colors">
                  <GraduationCapIcon className="size-5 text-white/40 group-hover:text-magenta transition-colors" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white group-hover:text-magenta transition-colors">Personal Companions</span>
                  <span className="text-[9px] uppercase tracking-[3px] font-black opacity-20">{companions.length} // CUSTOM_ARCHITECTURES</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-10">
              <CompanionsList title="" companions={companions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: number, label: string }) => (
  <div className="flex flex-col gap-4 p-8 border border-white/5 bg-black/20 min-w-[160px] relative group overflow-hidden">
    <div className="absolute top-0 left-0 w-px h-0 bg-magenta group-hover:h-full transition-all duration-700"></div>
    <div className="flex items-center justify-between">
      {icon}
      <p className="text-3xl font-serif italic text-white">{value}</p>
    </div>
    <div className="text-[9px] font-black uppercase tracking-[3px] opacity-30 group-hover:opacity-100 transition-opacity">{label}</div>
  </div>
);

export default Profile;
