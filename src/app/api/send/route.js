import { Resend } from 'resend';
import {KoalaWelcomeEmail} from '@/components/EmailTemplate'
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request) {
    const { firstName,
        jobTitle,
        companyName,
        email } = await request.json()
    try {
        const { data } = await resend.emails.send({
          from: 'GetHired<onboarding@resend.dev> ',
          to: 'tonyligogo@gmail.com',
          subject: 'Congratulations! You have been hired!',
          react: KoalaWelcomeEmail({ firstName, jobTitle, companyName })
        });
        return NextResponse.json({data});
    } catch (error) {
        return NextResponse.json({error});
    }
}