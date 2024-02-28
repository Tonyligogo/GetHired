"use server"

import { createJobSchema } from "@/lib/formValidation";
import { NextResponse } from "next/server";
import { server } from "@/server";

export async function createJobPosting(formData) {

    const values = Object.fromEntries(formData.entries());
    
    const {
        title, type, companyName, location, locationType,requirements, salary, description
    } = createJobSchema.parse(values)

    const res = await fetch(`${server}post/createPost`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: values,
  })
 
  const data = await res.json()
 
  return NextResponse.json(values)
}

