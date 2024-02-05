import { jobTypes, locationTypes } from '@/jobTypes';
import z from 'zod';

const requiredString = z.string().min(1, "Required")

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1024 * 1024 * 2;

const companyLogoSchema = z.object({
  companyLogo:
    z.any()
    // .refine(file => file?.size <= MAX_FILE_SIZE, "File must be less than 2MB")
    // .refine(
    //     (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //     "Must be an image file"
    //     )
})
const theRealLogo = companyLogoSchema.optional().nullable()
// const companyLogoSchema = z.custom<File| undefined>().refine(file => 
//     !file || ( file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file?.type)), "Must be an image file")
//     .refine(file => {
//         return !file || file.size < 1024 * 1024 * 2
//     }, "File must be less than 2MB")

const numericRequiredString = requiredString.regex(/^\d+$/, "Must be a number")

const applicationSchema = z.object({
    applicationEmail: z.string().max(100).email().optional().or(z.literal("")),
    applicationUrl: z.string().max(100).url().optional().or(z.literal(""))
}).refine(data => data.applicationEmail || data.applicationUrl, {
    message: "Email or url is required",
    path:["applicationEmail"]
})

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
//  companyLogo: companyLogoSchema,
 description: z.string().max(700).optional(),
 salary:numericRequiredString.max(9, "Number cannot be longer than 9 digits")
}).and(theRealLogo).and(locationSchema).and(applicationSchema);


export const jobFilterSchema = z.object({
 q: z.string().optional(),
 type: z.string().optional(),
 location: z.string().optional(),
 remote: z.coerce.boolean().optional(),
});

