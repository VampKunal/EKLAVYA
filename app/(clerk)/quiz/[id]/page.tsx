import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCompanion } from "@/lib/actions/companion.actions";
import { generateQuizForCompanion } from "@/lib/actions/quiz.actions";
import QuizRunner from "@/components/quiz/QuizRunner";

export default async function QuizByCompanionPage({ params }: { params: { id: string }}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const companion = await getCompanion(params.id);
  if (!companion?.id) redirect('/quiz');

  const questions = await generateQuizForCompanion(companion, 6);

  return (
    <main>
      <section className="flex items-center justify-between">
        <h1>Quiz: {companion.name}</h1>
      </section>
      <QuizRunner companionId={companion.id} companionName={`${companion.subject} • ${companion.topic}`} questions={questions} />
    </main>
  )
}


