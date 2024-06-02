import {Fragment} from "react";
import {SubmitHandler,useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterFormSchema, RegisterFormType} from "../types/Register.ts";


const Register = () => {

    const {register
        ,handleSubmit
        ,formState:{errors,isValid}
    } = useForm<RegisterFormType>({resolver:zodResolver(RegisterFormSchema)})

    const onSubmit:SubmitHandler<RegisterFormType> = async(data:RegisterFormType)=>{
        if(isValid){
            console.log('ready to learn react query');
            console.log(data);
        }

    }

    return <Fragment>
        <form onSubmit={handleSubmit(onSubmit)}>
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
        </form>
    </Fragment>
}
export default Register;