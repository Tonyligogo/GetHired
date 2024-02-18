"use client"

import { useFormState } from 'react-dom'
import styles from '../allJobs/page.module.css'
import { apply } from './actions';
import { useState } from 'react';
import { useSession } from 'next-auth/react';


export default function ActionSidebar({job}) {

    return (
    <aside>
        <ApplyButton jobId={job?.post?._id}/>
    </aside>
  )
}

function ApplyButton({jobId}){

    const[formState, formAction] = useFormState(apply, undefined)

    return (
    <form action={formAction}>
        <input name='jobId' hidden value={jobId} readOnly/>
        <button type='submit' className={styles.actionSidebarBtn}>Apply Now</button>
        {formState?.error && ( <p>{formState.error}</p> )}
    </form>
    )
   
}
