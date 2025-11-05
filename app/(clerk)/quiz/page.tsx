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
    <main className="px-6 py-8 w-full max-w-5xl mx-auto">
      <section className="flex items-center justify-between mb-6">
        <h1>Quizzes</h1>
        <Link href="/companion/new" className="btn-primary">Create Companion</Link>
      </section>

      {(!companions || companions.length === 0) ? (
        <div className="rounded-border p-10 text-center text-[var(--color-muted-foreground)]">
          <p className="mb-2">No companions yet.</p>
          <p>Create a companion to unlock its quiz here.</p>
        </div>
      ) : (
        <section className="companions-grid">
          {companions.map((c: any) => (
            <HoverDevCard key={c.id}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{c.name}</h2>
                <span className="px-3 py-1 rounded-2xl text-sm bg-[var(--color-accent)] transition-colors duration-200">{c.subject}</span>
              </div>
              <p className="text-sm">{c.topic}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recommended: {c.duration} min</span>
                <Link href={`/quiz/${c.id}`} className="btn-primary">Start Quiz</Link>
              </div>
            </HoverDevCard>
          ))}
        </section>
      )}
    </main>
  );
}
