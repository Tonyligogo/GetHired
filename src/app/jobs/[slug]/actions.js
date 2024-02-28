"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axios from 'axios'
import { server } from '@/server';


export async function apply(prevState, formData) {

    try {
        const jobId = formData.get("jobId")
        const userId = formData.get("userId")
        await axios.post(`${server}jobSeeker/applyForJob/${jobId}/user/${userId}`)
        .then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err, 'this is from the jobs actions applyJob')
        })

        // revalidatePath("/")

    } catch (error) {
        let message = "Unexpected error"
        if(error){
            message = error.message;
        }
        return {error: message}
    }
    redirect('/jobs/allJobs')

}
