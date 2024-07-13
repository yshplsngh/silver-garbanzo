import {createContext, ReactNode, useState, ReactElement, useEffect} from 'react'
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {AxiosError} from "axios";
import {UserProfileType} from "../types/User.ts";

export interface AxiosOMessageResponse {
    message: string;
}

const initialState: UserProfileType = {
    user: {
        id: 0,
        name: '',
        picture: '',
        email: '',
        verified:false
    },
    iat: 0,
    exp: 0
}

export type UseProfileContextType = {
    profile: UserProfileType,
    setProfile: (profile: UserProfileType) => void,
    isSuccess: boolean,
    isLoading:boolean,
    isError: boolean,
}

const initContextState: UseProfileContextType = {
    profile: initialState,
    setProfile:()=>{},
    isSuccess:true,
    isLoading:true,
    isError:false
}

const ProfileContext = createContext<UseProfileContextType>(initContextState)

type ChildrenType = { children?: ReactNode }

export const UserProvider = ({children}: ChildrenType): ReactElement => {
    const [profile, setProfile] = useState<UserProfileType>(initialState)

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData<UserProfileType>(["userProfile"]);

    const {data, error, isError, isSuccess,isLoading} = useQuery<UserProfileType, AxiosError<AxiosOMessageResponse>>({
        queryKey: ['userProfile'],
        queryFn: () => bashApi.get('/user/me')
            .then(res => res.data),
        initialData: cachedData,
        retry: false,
        refetchOnWindowFocus: true
    })

    // console.log(isSuccess);
    useEffect(() => {
        if (isSuccess && data) {
            setProfile(data);
            console.log(data);
        } else if (isError && error) {
            // if (error?.response?.status !== 435) {
            //     toast.error(error.response?.data?.message);
            // }
            setProfile(initialState);
        }
    }, [isSuccess, data, isError,error]);

    return (
        <ProfileContext.Provider value={{profile,setProfile,isSuccess,isLoading,isError}}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;
