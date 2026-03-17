import { createClient } from '@/utils/supabase/client'

/**
 * Marks a lesson as completed for the current student.
 * This will trigger the backend function to update the overall course progress.
 */
export async function markLessonAsCompleted(courseId: string, lessonId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'User not authenticated' }

  const { error } = await supabase
    .from('lesson_completions')
    .insert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
    })

  if (error) {
    if (error.code === '23505') {
       // already completed
       return { success: true, message: 'Lesson already completed' }
    }
    console.error('Error marking lesson as completed:', error.message)
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Fetches the completion status for all lessons in a course for the current student.
 */
export async function getLessonCompletions(courseId: string) {
   const supabase = createClient()
   
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) return { error: 'User not authenticated' }
 
   const { data, error } = await supabase
     .from('lesson_completions')
     .select('lesson_id')
     .eq('user_id', user.id)
     .eq('course_id', courseId)
 
   if (error) {
     console.error('Error fetching lesson completions:', error.message)
     return { error: error.message }
   }
 
   return { data: data.map(item => item.lesson_id) }
}
