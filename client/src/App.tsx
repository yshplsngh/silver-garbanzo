import {Route, Routes} from "react-router-dom";
import Register from "./component/Register.tsx";
import RequireAuth from "./component/RequireAuth.tsx";
import Post from "./component/Post.tsx";

function App() {
    return <Routes>
        <Route path='/' element=<Register/>/>
        <Route path='/post' element=<RequireAuth/>>
            <Route index element=<Post/>/>
        </Route>
    </Routes>
}

export default App
