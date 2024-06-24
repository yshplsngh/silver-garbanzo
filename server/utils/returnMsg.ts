export default function returnMsg(isValid: any): string {
    const key: string = isValid.error.errors[0].message
    if (typeof key === "undefined") {
        return "Unknown zod Error"
    }
    return key;
}
