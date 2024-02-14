"use server";

import { isAdmin } from '@/components/utils';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axios from 'axios'
import {User} from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs";
import { server } from '@/server';


export async function approveSubmission(prevState, formData) {

    try {
        const jobId = formData.get("jobId")

        const user = await currentUser();
        const { sessionClaims } = auth();
 
        // If the user does not have the admin role, redirect them to the home page
        if (sessionClaims?.metadata.role !== "admin") {
            throw new Error("You are not authorised to access this page")
        }

        if(!user || !isAdmin(user)){
            throw new Error("Not authorised to access this page")
        }
        
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

        const user = await currentUser();

        if(!user || !isAdmin(user)){
            throw new Error("Not authorised to access this page")
        }

        // await fetch('http://localhost:8000/post/deleteApprovalJob'+jobId)

        await axios.delete(`${server}post/deleteApprovalJob${jobId}`)
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