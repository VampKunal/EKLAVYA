import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import CompanionForm from "@/components/companion/CompanionForm";

const NewCompanion = async () => {
    const { userId } = await auth();
    if(!userId) redirect('/sign-in');

    return (
        <main className="flex-grow w-full max-w-5xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative reveal-section">
            <section className="flex flex-col mb-16 border-b border-white/5 pb-10">
                <h1 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash">Companion Builder</h1>
                <p className="text-[10px] uppercase tracking-[4px] opacity-40 font-black mt-4">
                    [ Architect_Mode ] // Design a custom cognitive node with specific subject expertise and neural personality.
                </p>
            </section>

            <article className="glass-morphism p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-[8px] uppercase tracking-[2px] opacity-10 font-black italic">PROTOCOL // EKV_INIT</div>
                <CompanionForm />
            </article>
        </main>
    )
}

export default NewCompanion
