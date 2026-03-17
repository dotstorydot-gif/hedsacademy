"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, CheckCircle, Loader2, ChevronLeft, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "true_false"
  correct_answer: string
  options: QuizOption[]
}

interface Quiz {
  id: string
  title: string
  passing_score: number
  questions: QuizQuestion[]
}

export default function QuizBuilderPage() {
  const params = useParams()
  const lessonId = params.lessonId as string
  const courseId = params.id as string
  const supabase = createClient()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [quizTitle, setQuizTitle] = useState("")
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  useEffect(() => {
    loadQuiz()
  }, [lessonId])

  const loadQuiz = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("quizzes")
      .select("*, questions(*)")
      .eq("lesson_id", lessonId)
      .single()
    if (data) {
      setQuiz(data)
      setQuizTitle(data.title)
      setPassingScore(data.passing_score || 70)
      setQuestions((data.questions || []).map((q: any) => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]")
      })))
    } else {
      // Pre-populate with one empty question
      setQuestions([makeEmptyQuestion()])
    }
    setLoading(false)
  }

  const makeEmptyQuestion = (): QuizQuestion => ({
    id: `temp-${Date.now()}`,
    question: "",
    type: "multiple_choice",
    correct_answer: "",
    options: [
      { id: `o1-${Date.now()}`, text: "", is_correct: false },
      { id: `o2-${Date.now()}`, text: "", is_correct: false },
      { id: `o3-${Date.now()}`, text: "", is_correct: false },
      { id: `o4-${Date.now()}`, text: "", is_correct: false },
    ]
  })

  const addQuestion = () => {
    setQuestions(prev => [...prev, makeEmptyQuestion()])
  }

  const updateQuestion = (qIdx: number, field: string, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, [field]: value } : q))
  }

  const updateOption = (qIdx: number, oIdx: number, text: string) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? {
      ...q,
      options: q.options.map((o, oi) => oi === oIdx ? { ...o, text } : o)
    } : q))
  }

  const setCorrectAnswer = (qIdx: number, oIdx: number) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? {
      ...q,
      correct_answer: q.options[oIdx].text,
      options: q.options.map((o, oi) => ({ ...o, is_correct: oi === oIdx }))
    } : q))
  }

  const deleteQuestion = (qIdx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== qIdx))
  }

  const handleSave = async () => {
    setSaving(true)
    let quizId = quiz?.id

    // Upsert quiz
    if (!quizId) {
      const { data } = await supabase
        .from("quizzes")
        .insert({ lesson_id: lessonId, title: quizTitle, passing_score: passingScore })
        .select()
        .single()
      quizId = data?.id
    } else {
      await supabase.from("quizzes")
        .update({ title: quizTitle, passing_score: passingScore })
        .eq("id", quizId)
      // Delete existing questions to replace
      await supabase.from("questions").delete().eq("quiz_id", quizId)
    }

    // Insert all questions
    if (quizId) {
      for (const q of questions.filter(q => q.question.trim())) {
        await supabase.from("questions").insert({
          quiz_id: quizId,
          question: q.question,
          type: q.type,
          correct_answer: q.correct_answer,
          options: q.options
        })
      }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    loadQuiz()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/instructor/courses/${courseId}/curriculum`} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-4" /> Back to Curriculum
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight uppercase italic">Quiz Builder</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">{questions.length} questions</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-8 shadow-xl hover:scale-105 transition-all"
        >
          {saving ? <Loader2 className="size-4 animate-spin mr-2" />
            : saved ? <CheckCircle className="size-4 mr-2 text-green-400" />
            : <Save className="size-4 mr-2" />}
          {saved ? "Saved!" : "Save Quiz"}
        </Button>
      </div>

      {/* Quiz Settings */}
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider">Quiz Title</label>
            <Input value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="e.g. React Props Proficiency Check" className="h-11 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider">Passing Score (%)</label>
            <div className="flex items-center gap-3">
              <Input
                type="number" min={0} max={100}
                value={passingScore}
                onChange={e => setPassingScore(Number(e.target.value))}
                className="h-11 font-bold"
              />
              <div className={cn(
                "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider",
                passingScore >= 70 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
              )}>
                {passingScore}% to pass
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <Card key={q.id} className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 flex flex-row items-center justify-between py-3 px-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Question {qIdx + 1}</span>
              <Button variant="ghost" size="icon" className="size-7 hover:text-destructive" onClick={() => deleteQuestion(qIdx)}>
                <Trash2 className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <Input
                value={q.question}
                onChange={e => updateQuestion(qIdx, "question", e.target.value)}
                placeholder="Type your question here..."
                className="h-12 font-bold text-base"
              />
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Answer Options — <span className="text-brand-dark-yellow">Click ✓ to mark the correct answer</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={opt.id} className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      opt.is_correct ? "border-green-500 bg-green-500/5" : "border-black/5 dark:border-white/5"
                    )}>
                      <button
                        className={cn(
                          "size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                          opt.is_correct ? "border-green-500 bg-green-500 text-white" : "border-black/20 dark:border-white/20 hover:border-green-500"
                        )}
                        onClick={() => setCorrectAnswer(qIdx, oIdx)}
                      >
                        {opt.is_correct && <CheckCircle className="size-3.5" />}
                      </button>
                      <Input
                        value={opt.text}
                        onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                        placeholder={`Option ${oIdx + 1}`}
                        className="h-7 text-sm border-0 bg-transparent focus:ring-0 shadow-none p-0 font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addQuestion}
        className="w-full h-14 border-2 border-dashed font-black uppercase text-[10px] tracking-widest hover:border-brand-yellow/50"
      >
        <Plus className="size-4 mr-2" /> Add Question
      </Button>
    </div>
  )
}
