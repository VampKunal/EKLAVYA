import {getAllCompanions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import CompanionCard from "@/components/companion/CompanionCard";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';

    const companions = await getAllCompanions({ subject, topic });

    return (
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative reveal-section">
            <section className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-white/5 pb-10 gap-8">
                <h1 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash">Neural Library</h1>
                <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                    <SearchInput />
                    <SubjectFilter />
                </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <Link href="/companion/new" className="group border border-white/5 bg-surface-container p-10 flex flex-col items-center justify-center transition-all duration-500 hover:border-magenta shadow-xl min-h-[300px] relative overflow-hidden img-box-texture">
                    <div className="absolute inset-0 bg-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <PlusCircleIcon className="size-16 text-white/10 group-hover:text-magenta transition-all mb-6" />
                    <p className="text-[11px] uppercase tracking-[4px] font-black opacity-40 group-hover:opacity-100 transition-opacity">Initialize_New_Node</p>
                </Link>
                {companions.map((companion) => (
                    <CompanionCard
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                    />
                ))}
            </section>
        </main>
    )
}

export default CompanionsLibrary
