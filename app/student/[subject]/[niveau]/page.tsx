import { redirect } from 'next/navigation'

export default async function OldCourseRoute({ params }: { params: Promise<{ subject: string; niveau: string }> }) {
  const { subject, niveau } = await params
  redirect(`/portal/${niveau}/${subject}`)
}
