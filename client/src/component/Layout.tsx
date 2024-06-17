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
                <div className={'mt-20 text-gray-50'}>
                    <Outlet/>
                </div>
            </main>}
        </main>
    )
}
export default Layout