import { redirect } from 'next/navigation'

export default function OldPortalCourseRoute({ params }: { params: { subject: string; niveau: string } }) {
  redirect(`/portal/${params.niveau}/${params.subject}`)
}
