"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { QuizQuestion } from "@/lib/actions/quiz.actions"
import { recordQuizAttempt } from "@/lib/actions/quiz.actions"

interface QuizRunnerProps {
  companionId: string
  companionName: string
  questions: QuizQuestion[]
}

export default function QuizRunner({ companionId, companionName, questions }: QuizRunnerProps) {
  const [wrongQids, setWrongQids] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ qid: string; choice: string; correct: boolean }[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState(false)

  const current = questions[currentIndex]

  const score = useMemo(
    () => answers.reduce((s, a) => s + (a.correct ? 1 : 0), 0),
    [answers]
  )

  const selectOption = (optionId: string) => {
    if (showExplanation) return
    setSelected(optionId)
  }

  const submit = () => {
    if (!selected || !current) return
    const correct = selected === current.correctOptionId
    setAnswers(prev => [...prev, { qid: current.id, choice: selected, correct }])
    if (!correct) setWrongQids(prev => [...prev, current.id])
    setShowExplanation(true)
  }

  const next = () => {
    setSelected(null)
    setShowExplanation(false)
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (!questions?.length) {
    return <div className="rounded-border p-8 text-center text-[var(--color-muted-foreground)]">No questions generated.</div>
  }

  if (completed) {
    // Build a compact review payload for companion
    const wrongQuestions = questions.filter(q => wrongQids.includes(q.id))
    const reviewText = wrongQuestions.map((q, idx) => {
      const correct = q.options.find(o => o.id === q.correctOptionId)
      return `${idx + 1}. ${q.question}\nCorrect: ${correct?.text}\n${q.explanation ? `Why: ${q.explanation}` : ''}`.trim()
    }).join('\n\n')
    const prompt = reviewText
      ? `I just took a quiz on ${companionName} and missed these. Please teach me these items with examples and short checks for understanding:\n\n${reviewText}`
      : `I completed a quiz on ${companionName}. Please give me a brief recap and a couple of challenge questions.`
    const href = `/companion/${companionId}?review=${encodeURIComponent(prompt.slice(0, 3000))}`
    const persist = async () => {
      try {
        await recordQuizAttempt({
          companionId,
          score,
          total: questions.length,
          mistakes: wrongQuestions.map(q => ({
            questionId: q.id,
            question: q.question,
            selectedOptionId: answers.find(a => a.qid === q.id)?.choice || '',
            correctOptionId: q.correctOptionId,
          }))
        })
      } catch (e) {
        console.error('Failed to record quiz attempt', e)
      }
    }

    void persist()

    return (
      <div className="rounded-border p-8 flex flex-col gap-4 items-center text-center">
        <h2 className="text-3xl font-bold">Quiz Complete</h2>
        <p className="text-lg">{companionName}</p>
        <p className="text-xl">Score: {score} / {questions.length}</p>
        <div className="flex gap-3 mt-2">
          <Button onClick={() => { setCompleted(false); setCurrentIndex(0); setAnswers([]); setWrongQids([]); }}>Retry</Button>
          <a href={href} className="btn-primary">Ask these to companion</a>
        </div>
      </div>
    )
  }

  return (
    <section className="rounded-border p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question {currentIndex + 1} / {questions.length}</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">{companionName}</p>
      </header>

      <div className="text-lg font-medium">{current.question}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {current.options.map(opt => {
          const isSelected = selected === opt.id
          const isCorrect = showExplanation && opt.id === current.correctOptionId
          const isWrong = showExplanation && isSelected && !isCorrect
          return (
            <button
              key={opt.id}
              onClick={() => selectOption(opt.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                "hover:-translate-y-[2px] hover:shadow-sm",
                isSelected && !showExplanation && "border-[var(--color-primary)] bg-[var(--color-accent)]",
                isCorrect && "border-green-500 bg-green-500/10",
                isWrong && "border-red-500 bg-red-500/10",
              )}
            >
              <span className="text-sm opacity-70">{opt.id.toUpperCase()}</span>
              <div className="font-medium">{opt.text}</div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 justify-end">
        {!showExplanation ? (
          <Button onClick={submit} disabled={!selected}>Submit</Button>
        ) : (
          <Button onClick={next}>{currentIndex + 1 >= questions.length ? 'Finish' : 'Next'}</Button>
        )}
      </div>

      {showExplanation && current.explanation && (
        <div className="rounded-xl border p-4 text-sm text-[var(--color-foreground)]">
          <span className="font-semibold">Explanation:</span> {current.explanation}
        </div>
      )}
    </section>
  )
}


