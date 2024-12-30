'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";




export default function Navbar() {

    const [state, setState] = useState(false)
    const [user, setUser] = useState({})
    const [userLogin, setUserLogin] = useState(false)
    const router = useRouter();
    const [profileState, setProfileState] = useState(false)
   
    const navigation = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Task", path: "/task" },
    ]

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn") && !target.closest(".menu") && !target.closest(".btn-select") && !target.closest(".profile-btn")) setState(false);
        };
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedUser = jwt.decode(token);
            setUser(decodedUser);
            setUserLogin(true)
            console.log(decodedUser)
        }

    }, [])

    function handleLogout() {
        localStorage.removeItem('token');
        router.push('/') // Redirect to home page
        window.location.reload();   // Reload the page to refresh the state
    }




    return (
        <nav className={`bg-white shadow-xl z-50 fixed  w-[100vw] p-3  md:text-sm ${state ? "shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" : ""}`}>
            <div className="gap-x-14 items-center max-w-screen-xxl mx-auto px-4 md:flex md:px-8">
                <div className="flex items-center justify-between  md:block">
                    <div className="flex items-center justify-center gap-x-2">
                    <Link href="/">
                        <img
                            src="https://icons.veryicon.com/png/o/business/vscode-program-item-icon/todo-2.png"
                            width={50}
                            height={25}
                            alt="fotodukaan logo"
                        />
                    </Link>
                    <p className="font-bold text-2xl">Tasky</p>
                    </div>
                    <div className="md:hidden flex gap-4">
                        <div className="flex ">
                            {userLogin && <div>
                                <img onClick={() => { setProfileState(!profileState) }} src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'} alt="" className=" profile-btn w-12 cursor-pointer h-12 rounded-full border-2" />

                            </div>}
                            {profileState  && !state && <div className="absolute translate-y-16  -translate-x-48 bg-[#0E2041] w-[80vw] md:w-60 flex-col flex items-center gap-4 justify-center rounded-2xl  p-3 ">
                                <div>
                                    <img src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'} alt="" className="w-12 h-12 rounded-full border-2" />

                                </div>
                                <h1 className="text-white font-bold">{user.name}</h1>
                                <div className="flex flex-col gap-5">
                                    <button onClick={handleLogout} className="flex items-center w-full justify-center gap-x-1 py-2 px-4 text-white font-medium bg-blue-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                        Logout
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                </div>
                            </div>}

                        </div>


                        <button className="menu-btn text-white hover:text-gray-800"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (

                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 blue1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? 'block' : 'hidden'} `}>
                    <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="text-[#0E2041] font-bold       hover:text-gray-400">
                                        <Link href={item.path} className="block">
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            })
                        }

                    </ul>
                    {userLogin ? (<div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
                        <div className="flex ">
                            <div>
                                <img onClick={() => { setProfileState(!profileState) }} src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'} alt="" className=" profile-btn w-12 cursor-pointer h-12 rounded-full border-2" />

                            </div>
                            <button onClick={() => { setProfileState(!profileState) }} className="profile-btn flex items-center justify-center gap-x-1 py-2 px-4 font-medium text-[#0E2041] hover:text-yellow-700 active:bg-[#0E2041] rounded-full md:inline-flex">
                                {user.name}
                            </button>
                        </div>

                        {profileState && <div className="absolute md:translate-y-32 bg-blue-600 w-[80vw] md:w-60 flex-col flex items-center gap-4 justify-center rounded-2xl  p-3 ">
                            <div>
                                <img src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'} alt="" className="w-12 h-12 rounded-full border-2" />

                            </div>
                            <h1 className="text-white font-bold">{user.name}</h1>
                            <div className="flex flex-col gap-5">
                                <button onClick={handleLogout} className="flex items-center w-full justify-center gap-x-1 py-2 px-4 text-white font-medium bg-blue-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                    Logout
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>

                            </div>
                        </div>}

                    </div>) :
                        (<div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">

                            <Link href="sign-up" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-blue-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                Sign up
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>)
                    }
                </div>
            </div>
        </nav>

    )
}