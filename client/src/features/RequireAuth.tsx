import {Navigate, Outlet, useLocation} from "react-router-dom";
import {toast} from "sonner";
import useProfile from "./useProfile.ts";

const RequireAuth = () => {
    const location = useLocation();

    const {profile, isSuccess,isError} = useProfile()

    // console.log(profile);
    // console.log({'loading':isLoading})
    // console.log({'success': isSuccess})

    if (!isSuccess && isError) {
        toast.error("Please Register");
        return <Navigate to={"/register"} replace state={{from: location}}/>
    }else if (!profile.user.verified) {
        toast.error("Please Verify your Email");
        return <Navigate to={"/verifyOTP"} replace state={{from: location}}/>
    } else {
        return <Outlet/>
    }
}

export default RequireAuth;
