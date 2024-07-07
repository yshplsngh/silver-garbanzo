import {Navigate, Outlet, useLocation} from "react-router-dom";
import {Toaster} from 'sonner'
import Header from "./Header.tsx";
import useProfile from "../features/useProfile.ts";
import Loading from "./Loading.tsx";

const Layout = () => {
    const {isLoading, profile: {user: {verified, email}}, isSuccess} = useProfile()
    const location = useLocation()

    if (isLoading || (isSuccess && email.length === 0)) {
        return <Loading/>
    } else if (location.pathname === '/verifyOTP') {
        if (verified) {
            // toast.info("You are already verified");
            return <Navigate to={"/"} replace state={{from: location}}/>;
        } else if (!isSuccess && email.length === 0) {
            // toast.info("Register first");
            return <Navigate to={"/register"} replace state={{from: location}}/>
        }
    }
    return <main>
        <Toaster richColors closeButton={true}/>
        <Header/>
        <div className={'op text-var-black pt-24 3xl:w-[100rem] 3xl:mx-auto'}>
            <Outlet/>
        </div>
    </main>
}
export default Layout

// import {Outlet} from "react-router-dom";
// import {Toaster} from 'sonner'
// import Header from "./Header.tsx";
// import useProfile from "../features/useProfile.ts";
// import Loading from "./Loading.tsx";
//
// const Layout = () => {
//     const {isLoading} = useProfile()
//     return (
//         <main>
//             {isLoading ? <Loading/> : <main className={'xl'}>
//                 <Toaster richColors closeButton={true}/>
//                 <Header/>
//                 <div className={'text-var-black pt-20'}>
//                     <Outlet/>
//                 </div>
//             </main>}
//         </main>
//     )
// }
// export default Layout