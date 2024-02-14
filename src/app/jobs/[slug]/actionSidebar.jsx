"use client"

import { useFormState } from 'react-dom'
// import styles from './Admin.module.css'
import { apply } from './actions';

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
        <input name='jobId' value={jobId} readOnly/>
        <button type='submit'>Apply</button>
        {formState?.error && ( <p>{formState.error}</p> )}
    </form>
    )
   
}
