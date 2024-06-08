import {Fragment} from "react";
import {SubmitHandler,useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterFormSchema, RegisterFormType} from "../types/Register.ts";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import axios from "axios";
import {toast} from 'sonner'
import {NavigateFunction, useNavigate} from "react-router-dom";


const Register = () => {

    const navigate:NavigateFunction = useNavigate();

    const {register
        ,handleSubmit
        ,formState:{errors,isValid}
    } = useForm<RegisterFormType>({resolver:zodResolver(RegisterFormSchema)})

    const registerMutation = useMutation({
        mutationFn:(data:RegisterFormType)=>{
            return bashApi.post('/user/register',data)
        },
        onSuccess:()=>{
            toast.success("User successfully registered!");
            // here i will navigate user to post page
            navigate('/posts')
        },
        onError: (error:Error) => {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data || "An error occurred. Please try again later.")
            } else {
                toast.error("An unknown error occurred")
            }
        }
    })

    const onSubmit:SubmitHandler<RegisterFormType> = async(data:RegisterFormType)=>{
        if (isValid) {
            try {
                await registerMutation.mutateAsync(data);
            } catch (err){
                // Error handling is already done in onError callback of useMutation
                console.log(`Unexpected Error ${err}`)
            }
        }
    }


    return <Fragment>
        <form className={'formSet'} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Name:</label>
            <input
                {...register("name", {required: true})}
                placeholder="John dev"
                type="text"
                id="name"
            />
            {errors.name && <p className="error-message">{errors.name?.message}</p>}

            <label htmlFor="email">Email:</label>
            <input
                {...register("email", { required: true })}
                placeholder="xyz@gmail.com"
                type="email"
                id="email"
            />
            {errors.email && (
                <p className="error-message">{errors.email?.message}</p>
            )}

            <label htmlFor="picture">Picture Link</label>
            <input
                {...register("picture", { required: true })}
                placeholder="profile.png"
                type="text"
                id="picture"
            />
            {errors.picture && (
                <p className="error-message">{errors.picture?.message}</p>
            )}

            <label htmlFor="password">Password:</label>
            <input
                {...register("password", { required: true })}
                type="password"
                id="password"
            />
            {errors.password && (
                <p className="error-message">{errors.password?.message}</p>
            )}

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
                {...register("confirmPassword", { required: true })}
                type="password"
                id="confirmPassword"
            />
            {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword?.message}</p>
            )}
            <button type='submit'>
                Submit
            </button>
        </form>
    </Fragment>
}
export default Register;