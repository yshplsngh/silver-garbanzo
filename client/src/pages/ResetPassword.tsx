import {useForm, SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {PasswordFormSchema, PasswordFormType} from "../types/Register.ts";
import {Fragment, useState} from "react";

const ResetPassword = () => {

    const [viewPassword, setViewPassword] = useState(
        {oldPassword: false, newPassword: false, newConfirmPassword: false});

    // const [viewCPassword, setViewCPassword] = useState<boolean>(false);


    const {
        handleSubmit,
        register,
        formState: {errors, isValid}
    } = useForm<PasswordFormType>({resolver: zodResolver(PasswordFormSchema)})

    const onSubmit: SubmitHandler<PasswordFormType> = async (data: PasswordFormType) => {
        if (isValid) {
            try {
                console.log(data);
                alert('succcessfull')
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={'w-fit'}>
                    <label htmlFor="oldPassword">Password:</label>
                    <input
                        {...register("oldPassword", {required: true})}
                        type={viewPassword ? "text" : "password"}
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
                        type={viewPassword ? "text" : "password"}
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
                    <label htmlFor="newConfirmPassword">Password:</label>
                    <input
                        {...register("newConfirmPassword", {required: true})}
                        type={viewPassword ? "text" : "password"}
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
                <button type={"submit"}>
                    Change
                </button>
            </form>
        </Fragment>
    )

}

export default ResetPassword;