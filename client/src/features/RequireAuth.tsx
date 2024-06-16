import {Navigate, Outlet, useLocation} from "react-router-dom";
import {toast} from "sonner";
import useProfile from "./useProfile.ts";
import Loading from "../component/Loading.tsx";


const RequireAuth = () => {
    const location = useLocation();

    const {profile,isSuccess,isLoading} =useProfile()

    // console.log({'loading':isLoading})
    // console.log({'success':isSuccess})

    if(isLoading){
        return <Loading/>;
    }
    else if(isSuccess || profile.user.email.length>0){
        return  <Outlet/>
    } else{
        toast.error("Please Authenticate to access this page.");
        return <Navigate to={"/"} replace state={{from: location}}/>
    }
}

export default RequireAuth;
