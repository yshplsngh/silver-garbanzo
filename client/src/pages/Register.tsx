import {useState} from "react";
import {SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterFormSchema, RegisterFormType} from "../types/Register.ts";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from 'sonner'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import {UserProfileType} from "../types/User.ts";
import useProfile from "../features/useProfile.ts";
import Button from "../component/Button.tsx";



const Register = () => {
    const navigate: NavigateFunction = useNavigate();
    const {setProfile} = useProfile()

    const [viewPassword, setViewPassword] = useState({password: false, confirmPassword: false});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register
        , handleSubmit
        , formState: {errors, isValid}
    } = useForm<RegisterFormType>({resolver: zodResolver(RegisterFormSchema)})

    const registerMutation = useMutation<AxiosResponse<UserProfileType>, AxiosError<AxiosOMessageResponse>, RegisterFormType>({
        mutationFn: (data: RegisterFormType) => {
            return bashApi.post('/user/register', data)
        },
        onSuccess: (response) => {
            toast.info("User successfully registered!");
            setProfile(response.data)
            setLoading(false);
            navigate('/verifyOTP')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            setError(error.response?.data?.message || "An error occurred. Please try again later.");
            setLoading(false);
        },
    })

    // if (registerMutation.isPending) {
    //     return <Loading/>;
    // }

    const onSubmit: SubmitHandler<RegisterFormType> = async (data: RegisterFormType) => {
        if (isValid) {
            setLoading(true);
            setError(null);
            registerMutation.mutate(data);
        }
    }

    return (
        <section className={'op flex justify-center items-center transition-all'}>
            <main className={'op bg-white w-[25rem] my-10 mx-auto px-9 py-10 rounded-lg shadow-2xl space-y-4'}>
                <p className={'op h-5 text-[0.8rem] text-red-500 block'}>{error}</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" id="name"
                               className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.name ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                               placeholder=" " required
                               {...register("name", {required: true})}
                        />
                        <label htmlFor="name"
                               className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                            Name
                        </label>
                        {errors.name && <p className={'text-[0.7rem] text-red-500'}>{errors.name?.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="email" id="email"
                               className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.email ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                               placeholder=" " required
                               {...register("email", {required: true})}
                        />
                        <label htmlFor="email"
                               className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                            Email-Id
                        </label>
                        {errors.email && <p className={'text-[0.7rem] text-red-500'}>{errors.email?.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" id="picture"
                               className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.picture ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                               placeholder=" " required
                               {...register("picture", {required: true})}
                        />
                        <label htmlFor="picture"
                               className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                            Profile Photo Link
                        </label>
                        {errors.picture && <p className={'text-[0.7rem] text-red-500'}>{errors.picture?.message}</p>}
                    </div>


                    <div className="relative z-0 w-full mb-5 group">
                        <div className={'flex'}>
                            <input
                                type={viewPassword.password ? "text" : "password"}
                                id="password"
                                className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.password ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                                placeholder=" " required
                                {...register("password", {required: true})}
                            />
                            <label htmlFor="password"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                                Password
                            </label>
                            <Button text={'👁️'} variant={'secondary'} type={'button'} onClick={() =>
                                setViewPassword((prevState) => (
                                    {...prevState, password: !prevState.password}
                                ))}
                            />
                        </div>
                        {errors.password &&
                            <p className={'text-[0.7rem] text-red-500'}>{errors.password?.message}</p>}
                    </div>


                    <div className="relative z-0 w-full mb-5 group">
                        <div className={'flex'}>
                            <input
                                type={viewPassword.confirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.confirmPassword ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                                placeholder=" " required
                                {...register("confirmPassword", {required: true})}
                            />
                            <label htmlFor="confirmPassword"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">
                                Confirm Password
                            </label>
                            <Button text={'👁️'} variant={'secondary'} type={'button'} onClick={() =>
                                setViewPassword((prevState) => (
                                    {...prevState, confirmPassword: !prevState.confirmPassword}
                                ))}
                            />
                        </div>
                        {errors.confirmPassword &&
                            <p className={'text-[0.7rem] text-red-500'}>{errors.confirmPassword?.message}</p>}
                    </div>

                    {/*<div className="relative z-0 w-full mb-5 group">*/}
                    {/*    <input type="checkbox" id="tac"*/}
                    {/*           className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.tac ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}*/}
                    {/*           placeholder=" " required*/}
                    {/*           {...register("tac", {required: true})}*/}
                    {/*    />*/}
                    {/*    <label htmlFor="tac"*/}
                    {/*           className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">*/}
                    {/*        Privacy Policy*/}
                    {/*    </label>*/}
                    {/*    {errors.email && <p className={'text-[0.7rem] text-red-500'}>{errors.email?.message}</p>}*/}
                    {/*</div>*/}


                    <div className="relative z-0 w-full mb-5 group">
                        <input id="tac" type="checkbox"
                               {...register("tac")}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="tac"
                               className="ms-2 text-sm font-medium text-gray-600">
                            I agree with the{" "}
                            <a href="/tac" target={"_blank"} className="text-blue-600 dark:text-blue-500 hover:underline">Privacy Policy</a>.
                        </label>
                        {errors.tac &&
                            <p className={'text-[0.7rem] text-red-500'}>{errors.tac?.message}</p>}
                    </div>

                    <Button text={'Register'} variant={'primary'} type={'submit'} className={'mt-10 w-40'} loading={loading}/>
                </form>
            </main>
        </section>
    )
}
export default Register;