import {Outlet} from "react-router-dom";
import {Toaster} from 'sonner'
import Header from "./Header.tsx";
import useProfile from "../features/useProfile.ts";
import Loading from "./Loading.tsx";

const Layout = () => {
    const {isLoading} = useProfile()
    return (
        <main>
            {isLoading ? <Loading/> : <main>
                <Toaster richColors closeButton={true}/>
                <Header/>
                <div className={'op text-var-black pt-24 3xl:w-[100rem] 3xl:mx-auto'}>
                    <Outlet/>
                </div>
            </main>}
        </main>
    )
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