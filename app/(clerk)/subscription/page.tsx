import {PricingTable} from "@clerk/nextjs";

const Subscription = () => {
    return (
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 xl:pl-[120px] relative reveal-section">
            <section className="flex flex-col mb-16 border-b border-white/5 pb-10">
                <h1 className="massive-text !normal-case !text-4xl md:!text-5xl tracking-tighter magenta-slash">Subscription</h1>
                <p className="text-[10px] uppercase tracking-[4px] opacity-40 font-black mt-4">
                    [ Phase_Upgrade ] // Unlock advanced cognitive modules and extended neural links.
                </p>
            </section>
            
            <div className="glass-morphism p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-24 bg-magenta"></div>
                <PricingTable />
            </div>
        </main>
    )
}
export default Subscription
