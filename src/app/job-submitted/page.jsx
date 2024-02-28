'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {

  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
        router.replace('/')
    }, 3000);
}, []);

  return (
    <div style={{display:'grid', placeItems:'center'}}>
        <h1>Job Posted successfully</h1>
        <p>Please wait for the admin to review your job post.</p>
    </div>
  )
}
