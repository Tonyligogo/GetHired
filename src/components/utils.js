import {UserResource} from "@clerk/types"
import {User} from "@clerk/nextjs/server"
import { useSession } from "next-auth/react";

export function toSlug(someString){
    return someString.lowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
}

export function isAdmin(user){
    const {data:session} = useSession()
    return session?.user.role === "Employer";
}