import {useState} from "react";
import {GrClose} from "react-icons/gr";
import {GiHamburgerMenu} from "react-icons/gi";
import {Link, useLocation} from "react-router-dom";
import '../assets/project.css'
import useProfile from "../features/useProfile.ts";
import Button from "./Button.tsx";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {profile: {user: {email, name, verified}}} = useProfile();
    const {pathname} = useLocation();

    return (
        <header className={'z-20 fixed w-full op border-b-2 border-gray-400 backdrop-blur'}>
            <nav
                className={`flex flex-row justify-between items-center op 3xl:w-[100rem] 3xl:mx-auto text-gray-800 px-7 h-20`}>
                <ul className={'hidden md:flex space-x-4 text-[1.4rem]'}>
                    <Link to={"/"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>Home</li>
                    </Link>
                    <Link to={"/posts"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>Posts</li>
                    </Link>
                    <Link to={"/tac"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>
                            Privacy Policy
                        </li>
                    </Link>
                    {email && <Link to={'/resetPassword'} className={''}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>
                            Reset Password
                        </li>
                    </Link>}
                    {email && !verified && <Link to={'/verifyOTP'} className={'text-red-400'}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-red-600'}>
                            Verify Account
                        </li>
                    </Link>}
                </ul>

                {/*compact navbar*/}
                <nav className={'md:hidden relative flex items-center'}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)}>{isMenuOpen ? <GrClose/> :
                        <GiHamburgerMenu/>}</button>
                    {isMenuOpen &&
                        <ul className={'flex flex-col absolute top-14 p-1 whitespace-nowrap bg-var-bg shadow-xl rounded-2xl px-3 py-3 space-y-2'}>
                            <Link to={"/"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>Home</li>
                            </Link>
                            {!email && <Link to={"/register"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>Register</li>
                            </Link>}
                            <Link to={"/posts"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>
                                    Posts
                                </li>
                            </Link>
                            <Link to={"/tac"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>
                                    Privacy Policy
                                </li>
                            </Link>
                            {email && <Link to={'/resetPassword'} className={''}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>
                                    Reset Password
                                </li>
                            </Link>}
                            {email && !verified && <Link to={'/verifyOTP'} className={''}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-black'}>
                                    Verify Account
                                </li>
                            </Link>}
                        </ul>
                    }
                </nav>

                {/*user icon and dropdown*/}
                {email && <div className={'flex items-center justify-center'}>
                    <p>{`${name.charAt(0).toUpperCase()}${name.slice(1)}`}</p>
                    <div className={'pp ml-2 w-9 h-9 rounded-full flex items-center justify-center bg-orange-400'}>
                        <span className={'text-xl'}>{`${name.charAt(0).toUpperCase()}`}</span>
                    </div>
                </div>}

                {/* when email in context not exist or route is not register Page */}
                {!email && pathname !== "/register" && <Link to={"/register"}>
                    <Button variant={"primary"} text={"Register"} className={'w-32'}/>
                </Link>}
            </nav>
        </header>
    )
}

export default Header;