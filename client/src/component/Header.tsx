import {useState} from "react";
import {GrClose} from "react-icons/gr";
import {GiHamburgerMenu} from "react-icons/gi";
import {Link} from "react-router-dom";
import '../assets/project.css'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        // hidden items-center gap-1 rounded-full px-4 lg:flex bg-gray-50 bg-opacity-60 hover:bg-opacity-80 backdrop-blur text-gray-900
        // cursor-pointer select-none whitespace-nowrap rounded-full p-3 font-semibold transition duration-300 hover:text-blue-400
        <header className={'z-20 fixed w-full top-4'}>
            <nav
                className={`flex flex-row justify-between op xl:w-[75rem] xl:mx-auto text-[#222831] bg-gray-50 font-bold px-7 py-2 rounded-full backdrop-blur `}>
                <ul className={'hidden sm:flex space-x-4 items-center'}>
                    <Link to={"/"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Home</li>
                    </Link>
                    <Link to={"/register"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Register</li>
                    </Link>
                    <Link to={"/tac"}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Privacy
                            Policy
                        </li>
                    </Link>
                    <Link to={'/setting/password'} className={''}>
                        <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Reset
                            Password
                        </li>
                    </Link>
                </ul>
                {/*compact navbar*/}
                <nav className={'sm:hidden relative flex items-center'}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)}>{isMenuOpen ? <GrClose/> :
                        <GiHamburgerMenu/>}</button>
                    {!isMenuOpen &&
                        // <nav className={'pp flex flex-col absolute top-8 p-1 whitespace-nowrap bg-gray-50 rounded-md'}>
                        //     <Link to={"/"}>Home</Link>
                        //     <Link to={"/register"}>Register</Link>
                        //     <Link to={"/tac"}>Privacy Policy</Link>
                        //     <Link to={'/setting/password'} className={''}>Reset Password</Link>
                        // </nav>
                        <ul className={'pp flex flex-col absolute top-8 p-1 whitespace-nowrap bg-gray-50 rounded-2xl px-3 py-3 space-y-2'}>
                            <Link to={"/"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Home</li>
                            </Link>
                            <Link to={"/register"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Register</li>
                            </Link>
                            <Link to={"/tac"}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Privacy
                                    Policy
                                </li>
                            </Link>
                            <Link to={'/setting/password'} className={''}>
                                <li className={'cursor-pointer select-none whitespace-nowrap transition duration-100 hover:text-[#0F4C75]'}>Reset
                                    Password
                                </li>
                            </Link>
                        </ul>
                    }
                </nav>

                {/*user icon and dropdown*/}
                <div className={'flex items-center justify-center'}>
                    <p>Yashpal</p>
                    <div className={'pp ml-2 w-9 h-9 rounded-full flex items-center justify-center bg-orange-400'}>
                        <span className={'text-xl'}>Y</span>
                    </div>
                </div>
            </nav>
        </header>
    )
}

// function Header() {
//     const [showMenu, setShowMenu] = useState(false);
//
//     return (
//         <header className="flex flex-row items-center justify-between sm:justify-around p-2 border-b-2 bg-gray-100">
//             <a
//                 href="/"
//                 className="flex items-center h-10 px-10 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-500 rounded-tl-full rounded-br-full font-bold uppercase italic text-white hover:opacity-90"
//             >
//                 Title
//             </a>
//             <nav className="hidden sm:flex justify-between items-center gap-4 font-semibold">
//                 <a href="#" className="hover:text-gray-500">
//                     Home
//                 </a>
//                 <a href="#" className="hover:text-gray-500">
//                     About
//                 </a>
//                 <a href="#" className="hover:text-gray-500">
//                     Contact
//                 </a>
//             </nav>
//             <nav className="sm:hidden flex flex-col items-end gap-1 font-semibold">
//                 <button
//                     onClick={() => setShowMenu(!showMenu)}
//                     className="sm:hidden font-bold text-xl hover:text-gray-500"
//                 >
//                     {showMenu ? <GrClose /> : <GiHamburgerMenu />}
//                 </button>
//                 {showMenu && (
//                     <>
//                         <a href="#" className="hover:text-gray-500">
//                             Home
//                         </a>
//                         <a href="#" className="hover:text-gray-500">
//                             About
//                         </a>
//                         <a href="#" className="hover:text-gray-500">
//                             Contact
//                         </a>
//                     </>
//                 )}
//             </nav>
//         </header>
//     );
// }

export default Header;