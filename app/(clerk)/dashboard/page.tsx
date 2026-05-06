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
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Welcome Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 size-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 size-64 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row justify-between gap-8 items-center relative z-10">
          <div className="flex gap-6 items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src={user.imageUrl}
                alt={user.firstName!}
                width={100}
                height={100}
                className="rounded-full relative border-2 border-background shadow-2xl object-cover size-24 md:size-28"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-3xl tracking-tight">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <UserCircleIcon className="size-4" />
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <StatCard 
              icon={<CheckCircle2Icon className="text-green-500" />} 
              value={sessionHistory.length} 
              label="Lessons Done" 
              className="bg-green-500/5 border-green-500/10"
            />
            <StatCard 
              icon={<GraduationCapIcon className="text-primary" />} 
              value={companions.length} 
              label="Companions" 
              className="bg-primary/5 border-primary/10"
            />
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <LayoutDashboardIcon className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Your Learning Hub</h2>
        </div>

        <Accordion type="multiple" defaultValue={['recent', 'bookmarks']} className="space-y-4">
          <AccordionItem value="recent" className="border rounded-2xl px-6 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <HistoryIcon className="size-5 text-orange-500" />
                </div>
                <span className="text-xl font-bold tracking-tight">Recent Sessions ({sessionHistory.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <CompanionsList
                title=""
                companions={sessionHistory}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bookmarks" className="border rounded-2xl px-6 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <StarIcon className="size-5 text-yellow-500 fill-yellow-500/20" />
                </div>
                <span className="text-xl font-bold tracking-tight">Bookmarked Companions ({bookmarkedCompanions.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <CompanionsList
                companions={bookmarkedCompanions}
                title=""
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="companions" className="border rounded-2xl px-6 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GraduationCapIcon className="size-5 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">My Created Companions ({companions.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <CompanionsList title="" companions={companions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};

const StatCard = ({ icon, value, label, className }: { icon: React.ReactNode, value: number, label: string, className?: string }) => (
  <div className={cn("flex-1 md:w-32 p-4 rounded-2xl border flex flex-col gap-1 shadow-sm transition-all hover:shadow-md", className)}>
    <div className="flex items-center gap-3">
      {icon}
      <p className="text-2xl font-bold tracking-tighter">{value}</p>
    </div>
    <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</div>
  </div>
);

export default Profile;
