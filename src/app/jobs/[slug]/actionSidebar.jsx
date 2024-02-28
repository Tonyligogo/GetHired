"use client"

import { useFormState } from 'react-dom'
import styles from '../allJobs/page.module.css'
import { apply } from './actions';
import { useSession } from 'next-auth/react';


export default function ActionSidebar({job}) {
    const {data:session} = useSession()

    return (
    <aside>
        <ApplyButton jobId={job?.post?._id} userId={session?.user?.id}/>
    </aside>
  )
}

function ApplyButton({jobId, userId}){

    const[formState, formAction] = useFormState(apply, undefined)

    return (
    <form action={formAction}>
        <input name='jobId' hidden value={jobId} readOnly/>
        <input name='userId' hidden value={userId} readOnly/>
        <button type='submit' className={styles.actionSidebarBtn}>Apply Now</button>
        {formState?.error && ( <p>{formState.error}</p> )}
    </form>
    )
   
}
