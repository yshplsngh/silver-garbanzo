import {useState} from "react";
import {GrClose} from "react-icons/gr";
import {GiHamburgerMenu} from "react-icons/gi";
import {Link} from "react-router-dom";
import '../assets/project.css'
import useProfile from "../features/useProfile.ts";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {profile:{user:{email,name,verified}}} = useProfile();

    return (
        <header className={'z-20 fixed w-full top-4'}>
            <nav
                className={`flex flex-row justify-between op xl:w-[75rem] xl:mx-auto text-[#222831] bg-gray-50 font-bold px-7 h-12 rounded-full backdrop-blur `}>
                <ul className={'hidden sm:flex space-x-4 items-center'}>
                    <Link to={"/"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Home</li>
                    </Link>
                    <Link to={"/posts"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>
                            Posts
                        </li>
                    </Link>
                    {!email && <Link to={"/register"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Register</li>
                    </Link>}
                    <Link to={"/tac"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>
                            Privacy Policy
                        </li>
                    </Link>
                    {email && <Link to={'/resetPassword'} className={''}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>
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
                <nav className={'sm:hidden relative flex items-center'}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)}>{isMenuOpen ? <GrClose/> :
                        <GiHamburgerMenu/>}</button>
                    {isMenuOpen &&
                        <ul className={'pp flex flex-col absolute top-8 p-1 whitespace-nowrap bg-gray-50 rounded-2xl px-3 py-3 space-y-2'}>
                            <Link to={"/"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Home</li>
                            </Link>
                            {!email && <Link to={"/register"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Register</li>
                            </Link>}
                            <Link to={"/tac"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>
                                    Posts
                                </li>
                            </Link>
                            <Link to={"/posts"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>
                                    Privacy Policy
                                </li>
                            </Link>
                            {email && <Link to={'/resetPassword'} className={''}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Reset
                                    Password
                                </li>
                            </Link>}
                            {email && !verified && <Link to={'/verifyOTP'} className={''}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>
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
            </nav>
        </header>
    )
}

export default Header;