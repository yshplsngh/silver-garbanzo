import {createContext, ReactNode, useState, ReactElement, useEffect} from 'react'
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {toast} from "sonner";
import {AxiosError} from "axios";

export type UserProfileType = {
    user: {
        id: number,
        name: string,
        picture: string,
        email: string,
    },
    iat: number,
    exp: number
}

export interface AxiosErrorResponse {
    message: string;
}

const initialState: UserProfileType = {
    user: {
        id: 0,
        name: '',
        picture: '',
        email: ''
    },
    iat: 0,
    exp: 0
}

export type UseProfileContextType = {
    profile: UserProfileType,
    setProfile: (profile: UserProfileType) => void,
}

const initContextState: UseProfileContextType = {
    profile: initialState,
    setProfile:()=>{}
}

const ProfileContext = createContext<UseProfileContextType>(initContextState)

type ChildrenType = { children?: ReactNode }

export const UserProvider = ({children}: ChildrenType): ReactElement => {
    const [profile, setProfile] = useState<UserProfileType>(initialState)

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData<UserProfileType>(["userProfile"]);

    const {data, error, isError, isSuccess} = useQuery<UserProfileType, AxiosError<AxiosErrorResponse>>({
        queryKey: ['userProfile'],
        queryFn: () => bashApi.get('/user/me')
            .then(res => res.data),
        initialData: cachedData,
        retry: false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    })

    useEffect(() => {
        if (isSuccess && data) {
            setProfile(data);
            console.log(data)
        } else if (isError && error) {
            if (error?.response?.status !== 435) {
                toast.error(error.response?.data?.message);
            }
            setProfile(initialState);
        }
    }, [isSuccess, data, isError]);

    return (
        <ProfileContext.Provider value={{profile,setProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;
