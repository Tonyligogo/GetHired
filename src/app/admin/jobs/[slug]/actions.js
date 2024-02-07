"use server";

import { isAdmin } from '@/components/utils';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axios from 'axios'
import {User} from "@clerk/nextjs/server"


export async function approveSubmission(prevState, formData) {

    try {
        const jobId = formData.get("jobId")

        const user = await currentUser();

        if(!user || !isAdmin(user)){
            throw new Error("Not authorised to access this page")
        }
        
        await axios.put('http://localhost:8000/post/approveJobUpdate/'+jobId)
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

        const user = await currentUser();

        if(!user || !isAdmin(user)){
            throw new Error("Not authorised to access this page")
        }

        // await fetch('http://localhost:8000/post/deleteApprovalJob'+jobId)

        await axios.delete('http://localhost:8000/post/deleteApprovalJob'+jobId)
        .then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err, 'this is from the jobs actions deleteApprovalJob')
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