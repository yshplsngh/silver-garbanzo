import {createContext, ReactNode, useState, ReactElement, useEffect} from 'react'
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {toast} from "sonner";

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

export type UseProfileContextType = { profile: UserProfileType }

const initContextState: UseProfileContextType = { profile: initialState }

const ProfileContext = createContext<UseProfileContextType>(initContextState)

type ChildrenType = { children?: ReactNode }

export const UserProvider = ({ children }: ChildrenType): ReactElement => {
    const [profile, setProfile] = useState<UserProfileType>(initialState)

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData(["userProfile"]);

    const {data, isError, isSuccess} = useQuery({
        queryKey:['userProfile'],
        queryFn:()=>bashApi.get('/user/me')
            .then(res=>res.data),
        initialData:cachedData,
        retry:false,
        refetchOnWindowFocus:true,
        refetchOnReconnect:true
    })

    useEffect(() => {
        if (isSuccess && data) {
            // const newData:UserProfileType = data
            console.log(data)
            setProfile(data);
        } else if (isError) {
            setProfile(initialState);
            // toast.error("Please Authenticate to access this page.");
            // return <Navigate to={"/"} replace state={{from: location}}/>
        }
    }, [isSuccess, data, isError]);

    return (
        <ProfileContext.Provider value={{ profile }}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;
