"use server"

import { createJobSchema } from "@/lib/formValidation";
import axios from "axios";
import {nanoid} from "nanoid"
import { NextResponse } from "next/server";

export async function createJobPosting(formData) {

    const values = Object.fromEntries(formData.entries());
    
    const {
        title, type, companyName, location, locationType,applicationEmail, applicationUrl, salary, description
    } = createJobSchema.parse(values)

  // await axios.post('http://localhost:8000/post/createPost', values)
  //       .then((res)=>{
  //           console.log(res)
  //       })
  //       .catch((err)=>{
  //           console.log(err, 'error in action.js')
  //       })

    const res = await fetch('http://localhost:8000/post/createPost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: values,
  })
 
  const data = await res.json()
 
  return NextResponse.json(values)
}

