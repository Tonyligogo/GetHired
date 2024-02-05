export function toSlug(someString){
    return someString.lowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
}