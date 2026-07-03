import { redirect } from 'next/navigation'

export default function OldCourseRoute({ params }: { params: { subject: string; niveau: string } }) {
  redirect(`/portal/${params.niveau}/${params.subject}`)
}
