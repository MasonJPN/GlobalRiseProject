'use client'
import {useState} from "react"
import Link from "next/link"

type Kid ={
    id: number
    firstName: string
    lastName: string
    email: string
}

type Driver = {
    id: number
    schoolName: string
    kids: Kid []
}

const schools: Driver[] = [
    {
        id: 1,
        schoolName: "みつわ台北小学校",
        kids: [
            { id: 1, firstName: "Yuki", lastName: "Tanaka", email: "parent1@gmail.com" },
            { id: 2, firstName: "Hana", lastName: "Sato", email: "parent2@gmail.com" },
        ]
    },
    {
        id: 2,
        schoolName: "千葉小学校",
        kids: [
            { id: 3, firstName: "Kenji", lastName: "Yamamoto", email: "parent3@gmail.com" },
            { id: 4, firstName: "Aoi", lastName: "Nakamura", email: "parent4@gmail.com" },
        ]
    },
    {
        id: 3,
        schoolName: "稲毛小学校",
        kids: [
            { id: 5, firstName: "Ren", lastName: "Kobayashi", email: "parent5@gmail.com" },
            { id: 6, firstName: "Mia", lastName: "Yoshida", email: "parent6@gmail.com" },
        ]
    }
]

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "1234"

export default function Drivers(){
    const [openedSchool, setOpenedSchool] = useState<number | null>(null)
    const [checkedKids, setCheckedKids] = useState<Record<number, boolean>>({})
    const [adminMode, setAdminMode] = useState(false)
    const [adminModal, setAdminModal] = useState(false)
    const [modalUsername, setModalUsername] = useState("")
    const [modalPassword, setModalPassword] = useState("")
    const [toast, setToast] = useState(false)
    const [toastMsg, setToastMsg] = useState("")
    function handleAdminLogout(){
        setAdminMode(false)
    }

    function handleModalSubmit(){
        if (modalUsername === ADMIN_USERNAME && modalPassword === ADMIN_PASSWORD) {
            setAdminMode(true)
            setAdminModal(false)
        }
    }
    // this is for the checkbox
    function handlePickUp(id: number){
        setCheckedKids((prev) => ({...prev, [id]: !prev[id]}))
    }

    
    //this is for the pick up button for drivers
    function handlePickedUp(kids: Kid[]){
    const pickedUpKids = kids.filter((kid) => checkedKids[kid.id] === true)
    
    if(pickedUpKids.length === 0) return

    // email would fire here for each kid when Firebase/Resend is connected
    // pickedUpKids.forEach((kid) => sendEmail(kid.email))

    setToastMsg(`${pickedUpKids.length} kid(s) marked as picked up ✅`)
    setToast(true)
    setTimeout(() => setToast(false), 4000)

    // clear the checkboxes
    setCheckedKids({})
}

    

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <Link href="/" className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 font-medium text-xl">
                ← Back
            </Link>

            <h1 className="text-5xl font-bold text-center text-gray-800 mb-10 mt-10">
                Bus Pickup
            </h1>

            <div className="max-w-2xl mx-auto flex flex-col gap-8">
                {schools.map((school) => (
                    <div key={school.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden gap-10">
                        <button
                            onClick={() => setOpenedSchool(openedSchool === school.id ? null : school.id)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-xl font-semibold text-gray-800">{school.schoolName}</span>
                            <span className="text-gray-400 text-lg">{openedSchool === school.id ? "▲" : "▼"}</span>
                        </button>

                        {openedSchool === school.id && (
                            <div className="border-t border-gray-100 flex flex-col">
                                {school.kids.map((kid) => (
                                    <div key={kid.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0">
                                        <p className="text-lg font-medium text-gray-800">{kid.lastName} {kid.firstName}</p>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={!!checkedKids[kid.id]}
                                                onClick={() => handlePickUp(kid.id)}
                                                className="w-6 h-6 accent-blue-400 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => handlePickedUp(school.kids)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-400 text-white hover:bg-blue-500 m-4">
                                    Picked Up
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {adminMode ? (
                    <button
                        onClick={handleAdminLogout}
                        className="flex items-center justify-center bg-blue-400 rounded-2xl px-6 py-4 shadow-sm border border-gray-100 text-white text-2xl font-semibold hover:bg-blue-500 mt-30">
                        Admin Logout
                    </button>
                ) : (
                    <button
                        onClick={() => setAdminModal(true)}
                        className="flex items-center justify-center bg-blue-400 rounded-2xl px-6 py-4 shadow-sm border border-gray-100 text-white text-2xl font-semibold hover:bg-blue-500 mt-30">
                        Edit
                    </button>
                )}
            </div>

            {adminModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white text-gray-800 rounded-2xl p-8 flex flex-col gap-4 w-96 shadow-xl">
                        <h2 className="text-2xl font-bold">Admin Login</h2>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Username:</label>
                            <input
                                value={modalUsername}
                                onChange={(e) => setModalUsername(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Password:</label>
                            <input
                                type="password"
                                value={modalPassword}
                                onChange={(e) => setModalPassword(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleModalSubmit}
                                className="flex-1 bg-blue-400 text-white py-2 rounded-xl font-semibold hover:bg-blue-500">
                                Submit
                            </button>
                            <button
                                onClick={() => setAdminModal(false)}
                                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-semibold hover:bg-gray-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
             <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-xl rounded-2xl px-8 py-6 flex items-center gap-3 z-50">
                 <p className="text-gray-800 font-medium text-2xl">{toastMsg}</p>
            </div>
                    )}
        </div>
    )
}