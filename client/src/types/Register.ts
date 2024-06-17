import {z} from 'zod'

enum errMsg {
    minPass = "password should be min 5 length",
    maxPass = "password should be max 100 length",
}

export const PasswordFormSchema = z.object({
    oldPassword: z.string().trim().min(1,"old Password Required"),
    newPassword: z.string().trim().min(5, errMsg.minPass).max(100, errMsg.maxPass),
    newConfirmPassword: z.string().trim(),
}).refine(data => data.newPassword === data.newConfirmPassword, {
    message: "password don't match",
    path: ["newConfirmPassword"]
})
export type PasswordFormType = z.infer<typeof PasswordFormSchema>

export interface PasswordFormTypeWithId extends PasswordFormType{
    id:number
}


export const RegisterFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().toLowerCase().email(),
    picture: z.string().trim().min(1, "Enter valid picture url"),
    password: z.string().trim().min(5, errMsg.minPass).max(100, errMsg.maxPass),
    confirmPassword: z.string().trim(),
    tac: z.boolean()
}).refine(data => data.password === data.confirmPassword, {
    message: "password don't match",
    path: ["confirmPassword"]
}).refine(data => data.tac, {
    message: "Terms and conditions must be accepted",
    path: ["tac"]
})
export type RegisterFormType = z.infer<typeof RegisterFormSchema>