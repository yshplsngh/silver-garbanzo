import { Outlet} from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { bashApi } from "../api/bashApi.tsx";
import {toast} from "sonner";
import Err404 from "./Err404.tsx";

const RequireAuth = () => {
    const { data, isLoading, isError,isSuccess } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => bashApi.get('/user/me')
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }else if(isError){
        toast.error("Authentication failed. Please log in again.")
        return <Err404/>
    }else if(isSuccess){
        console.log(data)
    }

    return <Outlet />;
};

export default RequireAuth;
