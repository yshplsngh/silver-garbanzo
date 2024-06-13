import {Navigate, Outlet, useLocation} from "react-router-dom";
import {toast} from "sonner";
import useProfile from "./useProfile.ts";



const RequireAuth = () => {
    const location = useLocation();

    const {profile} =useProfile()
    // console.log(profile);

    if(profile.user.email.length>0){
        return <Outlet/>
    }else{
        toast.error("Please Authenticate to access this page.");
        return <Navigate to={"/"} replace state={{from: location}}/>
    }
}

export default RequireAuth;
