import {UserResource} from "@clerk/types"
import {User} from "@clerk/nextjs/server"

export function toSlug(someString){
    return someString.lowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
}

export function isAdmin(user){
    return user.publicMetadata?.role === "admin";
}