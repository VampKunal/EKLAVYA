import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-20 relative reveal-section">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-magenta/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="glass-morphism p-1 relative z-10 border border-white/10 shadow-2xl">
                <SignIn />
            </div>
            <p className="text-[10px] uppercase tracking-[4px] font-black opacity-20 mt-12">AUTHENTICATION_PROTOCOL // EKV_SECURE</p>
        </main>
    )
}