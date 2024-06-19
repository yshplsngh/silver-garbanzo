import {Navigate, Outlet, useLocation} from "react-router-dom";
import {toast} from "sonner";
import useProfile from "./useProfile.ts";


const RequireAuth = () => {
    const location = useLocation();

    const {profile, isSuccess} = useProfile()

    // console.log({'loading':isLoading})
    // console.log({'success':isSuccess})

    if (!profile.user.verified) {
        return <Outlet/>
        // toast.error("Please Verify your Email");
        // return <Navigate to={"/verifyOTP"} replace state={{from: location}}/>
    } else if (isSuccess || profile.user.email.length > 0) {
        return <Outlet/>
    } else {
        toast.error("Please Authenticate to access this page.");
        return <Navigate to={"/"} replace state={{from: location}}/>
    }
}

export default RequireAuth;
