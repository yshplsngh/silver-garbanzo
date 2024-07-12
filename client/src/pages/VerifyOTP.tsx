import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {OTPFormType, OTPFormTypeWithId, OTPFromSchema} from "../types/Register.ts";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {toast} from "sonner";
import {AxiosError, AxiosResponse} from "axios";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import useProfile from "../features/useProfile.ts";
import Button from "../component/Button.tsx";

interface OTPDataType {
    userId: number;
    email: string;
}

const VerifyOTP = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {profile, setProfile} = useProfile();
    const {user: {id: cId, email: cEmail, verified}} = profile;
    const hasSentOTP = useRef(false);

    const sendOTPMutation = useMutation<AxiosResponse, AxiosError<AxiosOMessageResponse>, OTPDataType>({
        mutationFn: (data: OTPDataType) => bashApi.post('/user/sendOTP', data),
        onError: (error) => {
            toast.error(error.response?.data?.message || "OTP server is Down. Please try again later.");
        }
    });

    const sendOTP = useCallback(() => {
        if (cId && cEmail && !verified && !hasSentOTP.current) {
            console.log('send otp');
            const data: OTPDataType = {userId: cId, email: cEmail};
            // console.log(data);
            sendOTPMutation.mutate(data);
            hasSentOTP.current = true;
        }
    }, [cId, cEmail, sendOTPMutation, verified]);

    useEffect(() => {
        sendOTP();
    }, [sendOTP]);


    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm<OTPFormType>({resolver: zodResolver(OTPFromSchema)});

    const OTPMutation = useMutation<AxiosResponse<AxiosOMessageResponse>, AxiosError<AxiosOMessageResponse>, OTPFormTypeWithId>({
        mutationFn: (data: OTPFormTypeWithId) => bashApi.post('/user/verifyOTP', data),
        onSuccess: (data) => {
            toast.success(data.data?.message);
            setProfile({
                ...profile,
                user: {...profile.user, verified: true}
            });
            navigate('/');
            setLoading(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            setError(error.response?.data?.message || "An error occurred. Please try again.");
            setLoading(false);
        }
    });

    const onSubmit: SubmitHandler<OTPFormType> = (data: OTPFormType) => {
        if (isValid) {
            setError(null);
            setLoading(true);
            OTPMutation.mutate({...data, userId: cId});
        }
    };

    return (
        <section className={'op flex justify-center items-center transition-all'}>
            {cEmail.length !== 0 &&
                <main className={'op bg-white w-[25rem] my-10 mx-auto px-9 py-14 rounded-lg shadow-2xl space-y-6'}>
                    <p className={'op h-5 text-[0.8rem] text-red-500 block'}>{error}</p>
                    <form onSubmit={handleSubmit(onSubmit)} className={'space-y-10'}>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="number" id="floating_text"
                                   className={`block py-1.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 ${errors.otp ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-blue-600"} peer`}
                                   placeholder=" " required
                                   {...register("otp", {required: true})}
                            />
                            <label htmlFor="floating_text"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7">OTP</label>
                            {errors.otp && <p className={'text-[0.7rem] text-red-500'}>{errors.otp?.message}</p>}
                        </div>
                        <div className={'flex justify-between'}>
                            <Button variant={'primary'} loading={loading} type={'submit'} text={"Verify OTP"}/>
                            <Button text={'Resend OTP'} variant={'secondary'} type={'button'} onClick={() => {
                                hasSentOTP.current = false;
                                sendOTP();
                            }}/>
                        </div>
                    </form>
                </main>}
        </section>
    )
};

export default VerifyOTP;
