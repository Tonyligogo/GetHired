import { jobTypes, locationTypes } from '@/jobTypes';
import z from 'zod';

const requiredString = z.string().min(1, "Required")

const numericRequiredString = requiredString.regex(/^\d+$/, "Must be a number")

const locationSchema = z.object({
    locationType: requiredString.refine(
        value => locationTypes.includes(value),
        "Invalid location type"
    ),
    location: z.string().max(100).optional()
}).refine(data => !data.locationType || data.locationType === "Remote" || data.location,{
    message: "Location is required for on-site jobs",
    path:["location"]
})

export const createJobSchema = z.object({
 title:requiredString.max(100),
 type: requiredString.refine(
    value=> jobTypes.includes(value),
    "Invalid job type"
 ),
 companyName:requiredString.max(100),
 description: z.string().max(700).optional(),
 requirements: z.string().max(700).optional(),
 salary:numericRequiredString.max(9, "Number cannot be longer than 9 digits")
}).and(locationSchema);


export const jobFilterSchema = z.object({
 q: z.string().optional(),
 type: z.string().optional(),
 location: z.string().optional(),
 remote: z.coerce.boolean().optional(),
});

