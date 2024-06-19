import {useForm, SubmitHandler} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import {OTPFormType, OTPFormTypeWithId, OTPFromSchema} from "../types/Register.ts";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {toast} from "sonner";
import {AxiosError, AxiosResponse} from "axios";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import useProfile from "../features/useProfile.ts";
import ARVerified from "./ARVerified.tsx";

interface OTPDataType {
    userId: number
    email: string
}

const VerifyOTP = () => {

    const navigate = useNavigate();

    // const {profile: {user: {id: cId, email: cEmail,verified}},setProfile} = useProfile();
    const {profile, setProfile} = useProfile()
    // console.log(profile);
    const {user: {id: cId, email: cEmail, verified}} = profile
    const sendOTPMutation = useMutation<AxiosResponse, AxiosError<AxiosOMessageResponse>, OTPDataType>({
        mutationFn: (data: OTPDataType) => {
            return bashApi.post('/user/sendOTP', data);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "OTP server is Down. Please try again later.");
        }
    })

    const hasSentOTP = useRef(false);

    useEffect(() => {
        (() => {
            if (cId && cEmail && !hasSentOTP.current && !verified) {
                console.log('send otp');
                const data: OTPDataType = {userId: cId, email: cEmail};
                sendOTPMutation.mutate(data);
                hasSentOTP.current = true;
            }
        })()
    }, [cId, cEmail, sendOTPMutation, verified]);


    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm<OTPFormType>({resolver: zodResolver(OTPFromSchema)});

    const OTPMutation = useMutation<AxiosResponse<AxiosOMessageResponse>, AxiosError<AxiosOMessageResponse>, OTPFormTypeWithId>({
        mutationFn: (data: OTPFormTypeWithId) => {
            return bashApi.post('/user/verifyOTP', data)
        },
        onSuccess: (data) => {
            toast.success(data.data?.message)

            setProfile({
                ...profile, user: {
                    ...profile.user,
                    verified: true
                }
            });

            navigate('/')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.")
        }
    })

    const onSubmit: SubmitHandler<OTPFormType> = (data: OTPFormType) => {
        if (isValid) {
            OTPMutation.mutate({...data, userId: cId})
        }
    }

    if (verified) {
        return <ARVerified/>
    }

    return <section>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="otp">OTP: </label>
                <input
                    {...register("otp", {required: true})}
                    id="otp"
                    type="number"
                    placeholder="1234"
                    className={'text-gray-950'}
                />
                {errors.otp && <p>{errors.otp?.message} pp</p>}
            </div>

            <button type='submit'>
                Verify OTP
            </button>
        </form>
    </section>


}
export default VerifyOTP;