import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {PasswordFormSchema, PasswordFormType, PasswordFormTypeWithId} from "../types/Register.ts";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {AxiosError, AxiosResponse} from "axios";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import useProfile from "../features/useProfile.ts";
import Button from "../component/Button.tsx";


const ResetPassword = () => {

    const {profile: {user: {id: id}}} = useProfile();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [viewPassword, setViewPassword] = useState(
        {oldPassword: false, newPassword: false, newConfirmPassword: false});

    const passwordChangeMutation = useMutation<AxiosResponse, AxiosError<AxiosOMessageResponse>, PasswordFormTypeWithId>({
        mutationFn: (data: PasswordFormTypeWithId) => {
            return bashApi.post('/user/resetPassword', data)
        },
        onSuccess: () => {
            toast.success("password changed successfully!");
            navigate('/')
            setLoading(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            setError(error.response?.data?.message || "An error occurred. Please try again.");
            setLoading(false);
        }
    })

    const {
        handleSubmit,
        register,
        formState: {errors, isValid}
    } = useForm<PasswordFormType>({resolver: zodResolver(PasswordFormSchema)});

    const onSubmit: SubmitHandler<PasswordFormType> = (data: PasswordFormType) => {
        if (isValid) {
            setError(null);
            setLoading(true);
            passwordChangeMutation.mutate({...data, id});
        }
    };

    return (
        <section className={'op flex justify-center items-center transition-all'}>
            <main className={'op bg-white w-[25rem] my-10 mx-auto px-9 py-14 rounded-lg shadow-2xl space-y-6'}>
                <p className={'op h-5 text-[0.8rem] text-red-500 block'}>{error}</p>
                <form onSubmit={handleSubmit(onSubmit)} className={''}>

                    <div className="relative z-0 w-full mb-5 group">
                        <div className={'flex'}>
                            <input
                                type={viewPassword.oldPassword ? "text" : "password"}
                                id="oldPassword"
                                className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.oldPassword ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                                placeholder=" " required
                                {...register("oldPassword", {required: true})}
                            />
                            <label htmlFor="oldPassword"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                                Old Password
                            </label>
                            <Button text={'👁️'} variant={'secondary'} type={'button'} onClick={() =>
                                setViewPassword((prevState) => (
                                    {...prevState, oldPassword: !prevState.oldPassword}
                                ))}
                            />
                        </div>
                        {errors.oldPassword &&
                            <p className={'text-[0.7rem] text-red-500'}>{errors.oldPassword?.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <div className={'flex'}>
                            <input
                                type={viewPassword.newPassword ? "text" : "password"}
                                id="newPassword"
                                className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.newPassword ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                                placeholder=" " required
                                {...register("newPassword", {required: true})}
                            />
                            <label htmlFor="newPassword"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                                New Password
                            </label>
                            <Button text={'👁️'} variant={'secondary'} type={'button'} onClick={() =>
                                setViewPassword((prevState) => (
                                    {...prevState, newPassword: !prevState.newPassword}
                                ))}
                            />
                        </div>

                        {errors.newPassword &&
                            <p className={'text-[0.7rem] text-red-500'}>{errors.newPassword?.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <div className={'flex'}>
                            <input
                                type={viewPassword.newConfirmPassword ? "text" : "password"}
                                id="newConfirmPassword"
                                className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.newConfirmPassword ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                                placeholder=" " required
                                {...register("newConfirmPassword", {required: true})}
                            />
                            <label htmlFor="newConfirmPassword"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                                Confirm Password
                            </label>
                            <Button text={'👁️'} variant={'secondary'} type={'button'} onClick={() =>
                                setViewPassword((prevState) => (
                                    {...prevState, newConfirmPassword: !prevState.newConfirmPassword}
                                ))}
                            />
                        </div>
                        {errors.newConfirmPassword &&
                            <p className={'text-[0.7rem] text-red-500'}>{errors.newConfirmPassword?.message}</p>}
                    </div>
                    <Button text={'Change'} variant={'primary'} type={'submit'} loading={loading}/>
                </form>
            </main>
        </section>
    );
};

export default ResetPassword;
