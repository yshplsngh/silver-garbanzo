import {useState} from "react";
import {GrClose} from "react-icons/gr";
import {GiHamburgerMenu} from "react-icons/gi";
import {Link} from "react-router-dom";
import {DiVim} from "react-icons/di";
import '../assets/project.css'


function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        // <header className={'pp'}>
            <header className={`flex flex-row justify-between op xl:w-[75rem] xl:mx-auto text-[#222831] bg-[#fcfcfd] font-bold p-2`}>
                <nav className={'hidden sm:flex space-x-4'}>
                    <Link to={"/"}>Home</Link>
                    <Link to={"/register"}>Register</Link>
                    <Link to={"/tac"}>Privacy Policy</Link>
                    <Link to={'/setting/password'} className={''}>Reset Password</Link>
                </nav>
                {/*compact navbar*/}
                <nav className={'sm:hidden relative'}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)}>{isMenuOpen ? <GrClose/> :
                        <GiHamburgerMenu/>}</button>
                    {!isMenuOpen &&
                        <nav className={'pp flex flex-col absolute top-8 p-1 whitespace-nowrap'}>
                            <Link to={"/"}>Home</Link>
                            <Link to={"/register"}>Register</Link>
                            <Link to={"/tac"}>Privacy Policy</Link>
                            <Link to={'/setting/password'} className={''}>Reset Password</Link>
                        </nav>
                    }
                </nav>

                {/*user icon and dropdown*/}
                <div className={'flex'}>
                    <p>Yashpal</p>
                    <p className={''}>Y</p>
                </div>
            </header>
        // </header>
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