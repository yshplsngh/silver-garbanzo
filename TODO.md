# 1. Add image upload option in Register form

import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, RegisterFormType } from "../types/Register";
import { useMutation } from "@tanstack/react-query";
import { bashApi } from "../api/bashApi";
import axios from "axios";

const Register = () => {
const [backendError, setBackendError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<RegisterFormType>({
        resolver: zodResolver(RegisterFormSchema),
        mode: "onChange"  // This mode checks validation on every change
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterFormType) => {
            return bashApi.post('/user/register', data);
        },
        onSuccess: (data) => {
            console.log(data);
            // here you can navigate the user to the post page
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setBackendError(error.response?.data || "An error occurred");
            } else {
                setBackendError("An unknown error occurred");
            }
        }
    });

    const onSubmit: SubmitHandler<RegisterFormType> = async (data: RegisterFormType) => {
        setBackendError(null);  // Clear previous error message
        if (isValid) {
            try {
                await registerMutation.mutateAsync(data);
            } catch (err) {
                // Error handling is already done in onError callback of useMutation
            }
        }
    };

    return (
        <Fragment>
            {backendError && <p>{backendError}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name">Name:</label>
                <input
                    {...register("name", { required: true })}
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
                {errors.email && <p className="error-message">{errors.email?.message}</p>}

                <label htmlFor="picture">Picture Link:</label>
                <input
                    {...register("picture", { required: true })}
                    placeholder="profile.png"
                    type="text"
                    id="picture"
                />
                {errors.picture && <p className="error-message">{errors.picture?.message}</p>}

                <label htmlFor="password">Password:</label>
                <input
                    {...register("password", { required: true })}
                    type="password"
                    id="password"
                />
                {errors.password && <p className="error-message">{errors.password?.message}</p>}

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    {...register("confirmPassword", { required: true })}
                    type="password"
                    id="confirmPassword"
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword?.message}</p>}

                <button type="submit">
                    Submit
                </button>
            </form>
        </Fragment>
    );
};

export default Register;
