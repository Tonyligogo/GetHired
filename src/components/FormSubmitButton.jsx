'use client'
import {useFormStatus} from 'react-dom';
import { CircularProgress } from "@mui/material";
import '../../src/app/globals.css'
 
 export default function FormSubmitButton(props) {

    const {pending} = useFormStatus(); 

   return (
     <button {...props} type='submit' disabled={props.disabled || pending}>
        {pending && <CircularProgress size="14px" className="progress"/>}
        <span>{props.children}</span>
     </button>
   )
 }
 