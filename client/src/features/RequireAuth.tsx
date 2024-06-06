import { Outlet } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { bashApi } from "../api/bashApi";
import { toast } from "sonner";
import Err404 from "../component/Err404";

// Component to require authentication for accessing routes
const RequireAuth = () => {
    const { data, isLoading,isSuccess, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => bashApi.get('/user/me')
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        toast.error("Authentication failed. Please log in again.");
        return <Err404 />;
    }

    if (isSuccess && data?.data) {
        return <Outlet />;
    }

    return null;
};

export default RequireAuth;
