'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, addDoc, deleteDoc, doc} from "firebase/firestore"

type Teacher = {
    id: string,
    lastName: string,
    firstName: string, 
    email: string,
}

type TeacherStatus = {
  status: "in" | "out"
  clockInTime: number | null
}

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "1234"

export default function TeacherSignIn(){

    const [adminMode, setAdminMode] = useState(false)
    const [teacherList, setTeacherList] = useState<Teacher[]>([])
    const [teacherStatus, setTeacherStatus] = useState<Record<string, TeacherStatus>>({})
    const [currentTime, setCurrentTime] = useState("")
    const [adminModal, setAdminModal] = useState(false)
    const [modalUsername, setModalUsername] = useState("")
    const [modalPassword, setModalPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [teacherEmail, setTeacherEmail] = useState("")
    const [clockSessions, setClockSessions] = useState<{teacherId: string, date: string, hoursWorked: number, payPeriod: string}[]>([])
    const [selectedPayPeriod, setSelectedPayPeriod] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "GlobalRiseStaffTimeCollection"), (snapshot) => {
            const sessions = snapshot.docs.map((doc) => ({
                ...doc.data()
            })) as {teacherId: string, date: string, hoursWorked: number, payPeriod: string}[]
            setClockSessions(sessions)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "GlobalRiseStaff"), (snapshot) => {
            const teachersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Teacher[]
            setTeacherList(teachersData)
        })
        return () => unsubscribe()
    }, [])

    function handleClockIn(id: string){
        setTeacherStatus((prev) => ({...prev, [id]: {
            status: "in",
            clockInTime: Date.now()
        }}))
    }

    function getPayPeriod(date: Date) {
        const day = date.getDate()
        const year = date.getFullYear()
        const month = date.getMonth()
        if (day >= 15) {
            return new Date(year, month, 15).toLocaleDateString("en-CA")
        } else {
            return new Date(year, month - 1, 15).toLocaleDateString("en-CA")
        }
    }

    async function handleClockOut(id: string) {
        const clockInTime = teacherStatus[id]?.clockInTime
        if (!clockInTime) return
        const hoursWorked = (Date.now() - clockInTime) / 3600000
        const today = new Date().toLocaleDateString("en-CA")
        await addDoc(collection(db, "GlobalRiseStaffTimeCollection"), {
            teacherId: id,
            date: today,
            hoursWorked: hoursWorked,
            payPeriod: getPayPeriod(new Date())
        })
        setTeacherStatus((prev) => ({...prev, [id]: {
            status: "out",
            clockInTime: null
        }}))
    }

    function handleModalSubmit(){
        if (modalUsername === ADMIN_USERNAME && modalPassword === ADMIN_PASSWORD) {
            setAdminMode(true)
            setAdminModal(false)
        }
    }

    async function handleAddTeacher(){
        await addDoc(collection(db, "GlobalRiseStaff"), {
            firstName: firstName,
            lastName: lastName,
            email: teacherEmail
        })
        setFirstName("")
        setLastName("")
        setTeacherEmail("")
    }

    async function handleRemoveTeacher(id: string){
        await deleteDoc(doc(db, "GlobalRiseStaff", id))
    }

    function handleAdminLogout(){
        setAdminMode(false)
    }

    const payPeriods = [...new Set(clockSessions.map((s) => s.payPeriod))]

    return (
        <div className="min-h-screen bg-[#d2f7fd] p-8">

            <Link href="/" className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 font-medium text-xl">
                ← Back
            </Link>

            <div className="text-center mb-16 mt-10">
                <p className="text-8xl font-bold text-gray-800 tracking-widest">{currentTime}</p>
                <p className="text-gray-700 mt-2 text-lg">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            <div className="max-w-2xl mx-auto flex flex-col gap-4">
                {teacherList.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                        <div>
                            <p className="text-2xl font-semibold text-gray-800">{teacher.lastName} {teacher.firstName}</p>
                            <p className="text-sm text-gray-400">{teacherStatus[teacher.id]?.status === "in" ? "🟢 Clocked In" : "⚪ Clocked Out"}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleClockIn(teacher.id)}
                                className={`px-4 py-2 md:py-4 md:px-5 rounded-xl text-sm md:text-lg font-semibold ${
                                    teacherStatus[teacher.id]?.status === "in"
                                        ? "bg-green-500 text-white"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}>
                                Clock In
                            </button>
                            <button
                                onClick={() => handleClockOut(teacher.id)}
                                className={`px-4 py-2 md:px-5 md:py-4 rounded-xl text-sm md:text-lg font-semibold ${
                                    teacherStatus[teacher.id]?.status === "out"
                                        ? "bg-red-400 text-white"
                                        : "bg-red-100 text-red-500 hover:bg-red-200"
                                }`}>
                                Clock Out
                            </button>
                            {adminMode && (
                                <button
                                    onClick={() => handleRemoveTeacher(teacher.id)}
                                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-600 hover:bg-gray-300">
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {adminMode && (
                    <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Teacher Hours Breakdown</h2>
                        <select
                            value={selectedPayPeriod}
                            onChange={(e) => setSelectedPayPeriod(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="">All periods</option>
                            {payPeriods.map((period) => (
                                <option key={period} value={period}>
                                    {period}
                                </option>
                            ))}
                        </select>
                        {teacherList.map((teacher) => {
                            const sessions = clockSessions.filter((s) =>
                                s.teacherId === teacher.id &&
                                (selectedPayPeriod === "" || s.payPeriod === selectedPayPeriod)
                            )
                            const total = sessions.reduce((a, b) => a + b.hoursWorked, 0)
                            return (
                                <div key={teacher.id} className="flex flex-col gap-2">
                                    <p className="font-semibold text-lg text-gray-700">{teacher.lastName} {teacher.firstName}</p>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-400 border-b border-gray-100">
                                                <th className="pb-1">Date</th>
                                                <th className="pb-1">Hours</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sessions.map((session, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-1 text-gray-600">{session.date}</td>
                                                    <td className="py-1 text-gray-600">{session.hoursWorked.toFixed(2)} hrs</td>
                                                </tr>
                                            ))}
                                            <tr className="font-semibold text-blue-400">
                                                <td className="pt-2">Total</td>
                                                <td className="pt-2">{total.toFixed(2)} hrs</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })}
                    </div>
                )}

                {adminMode && (
                    <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-300 flex items-center gap-4">
                        <input
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
                        />
                        <input
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
                        />
                        <input
                            placeholder="Email"
                            value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
                        />
                        <button
                            onClick={handleAddTeacher}
                            className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-400 text-white hover:bg-blue-500">
                            Add Teacher
                        </button>
                    </div>
                )}

                {adminMode ? (
                    <button
                        onClick={handleAdminLogout}
                        className="flex items-center justify-center bg-blue-400 rounded-2xl px-6 py-4 shadow-sm border border-gray-100 text-white text-2xl font-semibold hover:bg-blue-500">
                        Admin Logout
                    </button>
                ) : (
                    <button
                        onClick={() => setAdminModal(true)}
                        className="flex items-center justify-center bg-blue-400 rounded-2xl px-6 py-4 shadow-sm border border-gray-100 text-white text-2xl font-semibold hover:bg-blue-500">
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
        </div>
    )
}