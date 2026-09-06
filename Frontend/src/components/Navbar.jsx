import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux"
import { useState } from "react";
import { linkWithCredential } from "firebase/auth";

function Navbar() {
    // === State Management ===
    const { userData ,city} = useSelector((state) => state.user)
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState(false)
    const handleLogOut = async()=>{
        try{
            const res = await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true
            });
                dispatch(setUserData(null));
        }catch(error){  
            console.log(error)
        }
    }
    
    return (
        <header className="fixed left-0 top-0 z-[9999] flex h-20 w-full items-center justify-center bg-[#fff9f6] px-4 shadow-sm">
            <div className="flex w-full max-w-7xl items-center justify-between gap-4">
                
                {/* === Left Side: Logo & Desktop Search === */}
                <div className="flex items-center gap-6 flex-1">
                    {/* Brand Logo */}
                    <h1 className="text-3xl font-bold text-[#ff4d2d] shrink-0">feastly</h1>

                    {/* Desktop Search Bar (Hidden on Mobile) */}
                    <div className="hidden md:flex h-12 flex-1 max-w-2xl items-center rounded-md bg-white px-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 pr-4 shrink-0">
                            <FaLocationDot size={20} className="text-[#ff4d2d]" />
                            <span className="truncate text-sm font-medium text-gray-600 max-w-[100px]">{city}</span>
                        </div>
                        <span className="h-6 w-px bg-gray-300 shrink-0" />
                        <div className="flex flex-1 items-center gap-3 pl-4">
                            <IoIosSearch size={20} className="shrink-0 text-[#ff4d2d]" />
                            <input type="text" placeholder="Search delicious food..." className="h-full w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* === Right Side: Actions & Profile === */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                    
                    {/* Mobile Search Icon / Close Icon (Hidden on Desktop) */}
                    {search ? (
                        <RxCross2 
                            size={24} 
                            className="shrink-0 text-[#ff4d2d] md:hidden cursor-pointer transition hover:scale-110" 
                            onClick={() => setSearch(false)}
                        />
                    ) : (
                        <IoIosSearch 
                            size={20} 
                            className="shrink-0 text-[#ff4d2d] md:hidden cursor-pointer transition hover:scale-110" 
                            onClick={() => setSearch(true)}
                        />
                    )}
                    
                    {/* Shopping Cart */}
                    <div className="relative cursor-pointer transition hover:scale-110">
                        <FiShoppingCart size={25} className="shrink-0 text-[#ff4d2d]" />
                        <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff4d2d] text-[10px] font-bold text-white">0</span>
                    </div>

                    {/* My Orders Button (Hidden on Mobile) */}
                    <button className="hidden sm:block px-4 py-1.5 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium transition hover:bg-[#ff4d2d]/20">
                        My Orders
                    </button>

                    {/* User Avatar - Toggles Profile Dropdown */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4d2d] text-[18px] font-semibold text-white shadow-md cursor-pointer transition hover:scale-105" onClick={() => setShow(prev => !prev)}>
                        {userData?.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
                    </div>
                    
                    {/* User Profile Dropdown (Conditional) */}
                    {show &&
                        <div className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
                            <div className="text-[17px] font-semibold "> {userData?.fullName} </div>
                            <div className="cursor-pointer hover:text-[#ff4d2d]" >My Orders</div>
                            <div className="cursor-pointer hover:text-[#ff4d2d]" onClick={handleLogOut}>Log out</div>
                        </div>
                    }
                </div>
            </div>

            {/* === Mobile Search Dropdown (Conditional) === */}
            {search && (
                <div className="absolute left-0 top-20 w-full bg-white p-4 shadow-md md:hidden z-[9998] border-t border-gray-100">
                    <div className="flex h-12 w-full items-center rounded-md bg-gray-50 px-4 border border-gray-200">
                        <div className="flex items-center gap-2 pr-3 shrink-0">
                            <FaLocationDot size={18} className="text-[#ff4d2d]" />
                            <span className="truncate text-sm font-medium text-gray-600 max-w-[80px]">{city}</span>
                        </div>
                        <span className="h-6 w-px bg-gray-300 shrink-0" />
                        <div className="flex flex-1 items-center gap-2 pl-3">
                            <IoIosSearch size={18} className="shrink-0 text-[#ff4d2d]" />
                            <input type="text" placeholder="Search delicious food..." className="h-full w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400" />
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
