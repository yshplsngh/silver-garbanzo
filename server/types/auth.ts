import {z} from 'zod'

enum errMsg{
    isEmail = "email should be correct type",
    minPass = "password should be min 5 length",
    maxPass = "password should be max 100 length",
}

export const SignupFormSchema = z.object({
    name:z.string().trim(),
    email:z.string().trim().toLowerCase().email(errMsg.isEmail),
    picture:z.string().trim(),
    password:z.string().trim().min(5,errMsg.minPass).max(100,errMsg.maxPass),
})

