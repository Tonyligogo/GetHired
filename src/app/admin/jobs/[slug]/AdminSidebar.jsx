"use client"

import { useFormState } from 'react-dom'
import styles from './Admin.module.css'
import { approveSubmission, deleteJob } from './actions';

export default function AdminSidebar({job}) {

    return (
    <aside className={styles.aside}>
        {job.approved ? <span>Approved</span> : ( <ApproveButton jobId={job?.post?._id}/> ) }
        <DeleteButton jobId={job?.post?._id}/>
    </aside>
  )
}

function ApproveButton({jobId}){

    const[formState, formAction] = useFormState(approveSubmission, undefined)

    return (
    <form action={formAction}>
        <input name='jobId' value={jobId} readOnly/>
        <button type='submit'>Approve</button>
        {formState?.error && ( <p>{formState.error}</p> )}
    </form>
    )
   
}
function DeleteButton({jobId}){

    const[formState, formAction] = useFormState(deleteJob, undefined)

    return (
    <form action={formAction}>
        <input hidden name='jobId' value={jobId} readOnly/>
        <button type='submit'>Delete</button>
        {formState?.error && ( <p>{formState.error}</p> )}
    </form>
    )
}
