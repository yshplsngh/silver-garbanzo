import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {PasswordFormSchema, PasswordFormType, PasswordFormTypeWithId} from "../types/Register.ts";
import {Fragment, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {AxiosError, AxiosResponse} from "axios";
import {AxiosErrorResponse} from "../features/UserProvider.tsx";
import useProfile from "../features/useProfile.ts";


const ResetPassword = () => {

    const {profile:{user:{id:id}}} = useProfile();

    const navigate = useNavigate();
    const [viewPassword, setViewPassword] = useState(
        {oldPassword: false, newPassword: false, newConfirmPassword: false});

    const passwordChangeMutation = useMutation<AxiosResponse,AxiosError<AxiosErrorResponse>,PasswordFormTypeWithId>({
        mutationFn:(data:PasswordFormTypeWithId)=>{
            return bashApi.post('/user/resetPassword',data)
        },
        onSuccess:()=>{
            toast.success("password changed successfully!");
            navigate('/')
        },
        onError:(error)=>{
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.")
        }
    })


    const {
        handleSubmit,
        register,
        formState: {errors, isValid}
    } = useForm<PasswordFormType>({resolver: zodResolver(PasswordFormSchema)});

    const onSubmit: SubmitHandler<PasswordFormType> = async (data: PasswordFormType) => {
        if(isValid){
            try{
                await passwordChangeMutation.mutateAsync({...data,id})
                // const register =
            }catch (error){
                console.log(`Error: ${error}`)
            }
        }
    };

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={'w-fit'}>
                    <label htmlFor="oldPassword">Password:</label>
                    <input
                        {...register("oldPassword", {required: true})}
                        type={viewPassword.oldPassword ? "text" : "password"}
                        id="oldPassword"
                        className={'text-gray-950'}
                    />
                    <button type={'button'} onClick={() =>
                        setViewPassword((prevState) => (
                            {...prevState, oldPassword: !prevState.oldPassword}
                        ))}>👁️
                    </button>
                    {errors.oldPassword && (
                        <p className="error-message">{errors.oldPassword?.message}</p>
                    )}
                </div>

                <div className={'w-fit'}>
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        {...register("newPassword", {required: true})}
                        type={viewPassword.newPassword ? "text" : "password"}
                        id="newPassword"
                        className={'text-gray-950'}
                    />
                    <button type={'button'} onClick={() =>
                        setViewPassword((prevState) => (
                            {...prevState, newPassword: !prevState.newPassword}
                        ))}>👁️
                    </button>
                    {errors.newPassword && (
                        <p className="error-message">{errors.newPassword?.message}</p>
                    )}
                </div>
                <div className={'w-fit'}>
                    <label htmlFor="newConfirmPassword">Confirm Password:</label>
                    <input
                        {...register("newConfirmPassword", {required: true})}
                        type={viewPassword.newConfirmPassword ? "text" : "password"}
                        id="newConfirmPassword"
                        className={'text-gray-950'}
                    />
                    <button type={'button'} onClick={() =>
                        setViewPassword((prevState) => (
                            {...prevState, newConfirmPassword: !prevState.newConfirmPassword}
                        ))}>👁️
                    </button>
                    {errors.newConfirmPassword && (
                        <p className="error-message">{errors.newConfirmPassword?.message}</p>
                    )}
                </div>
                <button type='submit' className={'border-2 border-amber-400'}>
                    Change
                </button>
            </form>
        </Fragment>
    );
};

export default ResetPassword;
