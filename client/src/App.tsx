import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register.tsx";
import RequireAuth from "./features/RequireAuth.tsx";
import Post from "./pages/Post.tsx";
import Layout from "./component/Layout.tsx";
import Err404 from "./pages/Err404.tsx";
import {Suspense} from "react";
import Loading from "./component/Loading.tsx";
import Testing from "./component/Testing.tsx";
import Home from "./pages/Home.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";

function App() {
    return <Suspense fallback={<Loading/>}>
        <Routes>
            <Route path={'/'} element={<Layout/>}>
                <Route index element=<Home/>/>
                <Route path='register' element=<Register/>/>
                <Route element=<RequireAuth/>>
                    <Route path={'posts'} element=<Post/>/>
                    <Route path={'resetPassword'} element=<ResetPassword/>/>
                </Route>
                <Route path={'test'} element={<Testing/>}/>
                <Route path={'*'} element={<Err404/>}/>
            </Route>
        </Routes>
    </Suspense>
}

export default App
