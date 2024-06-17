import {z} from 'zod'

enum errMsg {
    minPass = "password should be min 5 length",
    maxPass = "password should be max 100 length",
}

export interface UserCDataType{
    id: number;
    email: string;
    name: string;
    picture:string;
    verified: boolean;
}

export type decodedTokenType = {
    user: UserCDataType,
    iat: number,
    exp: number
}

export const PasswordFormSchema = z.object({
    id:z.number(),
    oldPassword: z.string().trim(),
    newPassword: z.string().trim().min(5, errMsg.minPass).max(100, errMsg.maxPass),
    newConfirmPassword: z.string().trim(),
}).refine(data => data.newPassword === data.newConfirmPassword, {
    message: "password don't match",
    path: ["confirmPassword"]
})


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

