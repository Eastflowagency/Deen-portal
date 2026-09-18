'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ClassroomData } from '@/lib/classroom'
export default function ClassLessonLinks({courseSlug}:{courseSlug:string}) {
  const [data,setData]=useState<ClassroomData|null>(null)
  const [error,setError]=useState(false)
  useEffect(()=>{let cancelled=false;fetch('/api/classroom',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error();return r.json()}).then(result=>{if(!cancelled)setData(result)}).catch(()=>{if(!cancelled)setError(true)});return()=>{cancelled=true}},[])
  if(error)return <p><Link href="/portal/klasse" style={{color:'#f8fafc'}}>Åpne klasserommet for leksjoner og materiell</Link></p>
  const lessons=data?.lessons.filter(l=>l.course_slug===courseSlug&&l.published)??[]
  if(!lessons.length)return null
  return <section style={{margin:'24px 0',padding:22,border:'1px solid #334155',borderRadius:14,background:'#0f1829',color:'#f8fafc'}}><h2 style={{fontSize:'1.15rem'}}>Fra klassen din</h2>{lessons.map(l=><p key={l.id}><Link href={`/portal/klasse?lessonId=${l.id}`} style={{color:'#f8fafc',textUnderlineOffset:4}}>{l.title} →</Link></p>)}</section>
}
