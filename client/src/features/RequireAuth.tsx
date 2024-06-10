import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useQuery, useQueryClient} from '@tanstack/react-query';
import { bashApi } from "../api/bashApi";
import { toast } from "sonner";
import Loading from "../component/Loading.tsx";

const RequireAuth = () => {

    const location = useLocation();

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData(["userProfile"]);

    const { data, isLoading,isSuccess, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => bashApi.get('/user/me')
            .then(res=>res.data),
        initialData:cachedData,
        retry:false,
        refetchOnWindowFocus:true,
        refetchOnReconnect:true
    });

    if (isLoading) return <Loading/>;

    if (isError) {
        toast.error("Please Authenticate to access this page.");
        return <Navigate to={"/"} replace state={{ from: location }} />
    }

    if (isSuccess && data) {
        return <Outlet />;
    }

    return null;
};

export default RequireAuth;
