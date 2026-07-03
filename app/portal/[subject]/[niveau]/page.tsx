import { redirect } from 'next/navigation'

export default async function OldPortalCourseRoute({ params }: { params: Promise<{ subject: string; niveau: string }> }) {
  const { subject, niveau } = await params
  redirect(`/portal/${niveau}/${subject}`)
}
