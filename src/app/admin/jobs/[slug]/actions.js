"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axios from 'axios'
import { server } from '@/server';


export async function approveSubmission(prevState, formData) {

    try {
        const jobId = formData.get("jobId")
        
        await axios.put(`${server}post/approveJobUpdate/${jobId}`)
        .then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err, 'this is from the jobs actions approveJobUpdate')
        })

        revalidatePath("/")

    } catch (error) {
        let message = "Unexpected error"
        if(error){
            message = error.message;
        }
        return {error: message}
    }
    redirect('/admin')

}

export async function deleteJob(prevState, formData){
    try {
        const jobId = formData.get("jobId")

        await axios.delete(`${server}post/deleteApprovalJob${jobId}`)
        .then((res)=>{
            console.log('This is from the jobs actions deleteApprovalJob. Job deleted successfully')
        }).catch((err)=>{
            console.log(err, 'This is from the jobs actions deleteApprovalJob. Job failed to be deleted.')
        })

        revalidatePath("/")

    } catch (error) {
        let message = "Unexpected error"
        if(error){
            message = error.message;
        }
        return {error: message}
    }
    redirect("/admin")
}