import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
function Navbar() {
    return (
        <header className="fixed left-0 top-0 z-[9999] flex h-20 w-full items-center justify-center bg-[#fff9f6] px-4">
            <div className="flex w-full max-w-4xl items-center gap-6">
                <h1 className="text-3xl font-bold text-[#ff4d2d]">feastly</h1>
                <div className="flex h-16 flex-1 items-center rounded-md bg-white px-4 shadow-xl">
                    <div className="flex min-w-28 items-center gap-3 pr-5">
                        <FaLocationDot size={25} className="shrink-0 text-[#ff4d2d]" />
                        <span className="truncate text-sm font-medium text-gray-600">jhansi</span>
                    </div>
                    <span className="h-9 w-px bg-gray-300" />
                    <div className="flex min-w-0 flex-1 items-center gap-3 pl-5">
                        <IoIosSearch size={25} className="shrink-0 text-[#ff4d2d]" />
                        <input type="text" placeholder="Search delicious food..." className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400" />
                    </div>
                </div>
                <div className="relative cursor-pointer">
                    <FiShoppingCart size={25} className="shrink-0 text-[#ff4d2d]" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff4d2d] text-[10px] font-bold text-white">0</span>
                </div>
            </div>
            <div><button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
                My Orders</button></div>
        </header>
    )
}

export default Navbar
