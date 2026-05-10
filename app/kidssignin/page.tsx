'use client'
import {useState, useEffect} from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, addDoc, deleteDoc, doc} from "firebase/firestore"

type Kid = {
  id: string;
  firstName: string;
  lastName: string;
  email: string
};


export default function KidsSignin() {

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "1234"

  const [kidsList, setKidsList] = useState<Kid[]>([])
  const [status, setStatus] = useState<Record<string, "in" | "out">>({})
  const [admin, setAdmin] = useState(false)  
  const [editMode, setEditMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalUsername, setModalUsername] = useState("")
  const [modalPassword, setModalPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [toast, setToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")


//This is sign in / out for kids
  function handleSignIn(id: string){
    const kid = kidsList.find((k) => k.id === id)
    setStatus((prev) => ({...prev, [id]: "in" })),
    setToast(true)
    setToastMsg(`${kid?.lastName} ${kid?.firstName} signed in successfully.  ✅`)
    setTimeout(() => {
      setToast(false)
    },4000)
  }

  function handleSignOut(id: string){
    const kid = kidsList.find((k) => k.id === id)
    setStatus((prev) => ({...prev, [id]: "out"}))
    setToast(true)
    setToastMsg(`${kid?.lastName} ${kid?.firstName} signed out successfully.`)
    setTimeout(() => {
      setToast(false)
    }, 4000)
  }


  function handleModalSubmit(){
    if (modalUsername === ADMIN_USERNAME &&
        modalPassword === ADMIN_PASSWORD
    ) {setAdmin(true), setEditMode(true), setIsModalOpen(false)}

  }

  async function handleRemoveStudent(id:string ){
    await deleteDoc(doc(db, "GlobalRise Students", id))
  }

  async function handleAddStudent(){
    await addDoc(collection(db, "GlobalRise Students"), {
        firstName: firstName,
        lastName: lastName,
        email: studentEmail
    })
    setFirstName("")
    setLastName("")
    setStudentEmail("")
}
 
  function handleAdminSignout(){
    setEditMode(false),
    setAdmin(false)
  }



  //this is for the firebase Firestore to update the kids 
    useEffect(() => {
      
    const unsubscribe = onSnapshot(collection(db, "GlobalRise Students"), (snapshot) => {
      console.log("snapshot received", snapshot.docs.length)
        const studentsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Kid[]
        setKidsList(studentsData)
        
    })
    return () => unsubscribe()
}, [])







  return (
    <div className="min-h-screen bg-[#ffffff] p-8">

      <div>
        <Link href="/" className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 font-medium text-xl">
        ← Back
        </Link>
      </div>



      <h1 className="text-6xl font-bold text-center text-gray-800 mb-20 mt-10">
        Hello / こんにちは!
      </h1>

      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        {kidsList.map(kid => {
          const s = status[kid.id]
          return (
            <div
              key={kid.id}
              className="flex items-center justify-between bg-white rounded-2xl px-6 py-10 shadow-sm border border-gray-100"
            >
              <p className="text-2xl font-semibold text-gray-800">
                {kid.lastName} {kid.firstName}
              </p>

              <div className="flex gap-3">
                <button className={`px-5 py-2 rounded-xl text-md font-semibold
                     ${ s === "in" ? "bg-green-500 text-white" :  "bg-green-100 text-green-700 hover:bg-green-200"}`}
                        onClick={() => handleSignIn(kid.id)}
                        >
                  Sign In
                </button>
                <button 
                    onClick={() => handleSignOut(kid.id)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold
                          ${s === "out" ? "bg-red-500 text-white" : "bg-red-100 text-red-500 hover:bg-red-200"}`}>
                  Sign Out
                </button>

                {editMode && (
                  <button className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-600 hover:bg-gray-300"
                          onClick={() => handleRemoveStudent(kid.id)}>
                    Delete
                  </button>)}

              </div>
            </div>
          )
        })}


        {editMode && (
        <div className="bg-white rounded-2xl w-220 mt-20 px-6 py-4 shadow-sm border border-gray-300 flex items-center gap-4 text-black">
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
                placeholder="Guardian Email"
                value={studentEmail}
                onChange={((e) => setStudentEmail(e.target.value))}
                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
            />
            <button
                onClick={handleAddStudent}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-400 text-white hover:bg-blue-500">
                Add Student
             </button>
        </div>
)}


        {editMode ? (<button className="px-5 py-2 text-2xl rounded-xl bg-blue-400 text-white"
                        onClick={handleAdminSignout}>
                 Admin Logout
        </button>) : (<button className="px-5 py-2 text-2xl rounded-xl bg-blue-400 text-white"
                onClick={() => setIsModalOpen(true)}>
                 Edit
        </button>)}

      </div>


            {isModalOpen && (

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
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-semibold hover:bg-gray-200">
                    Cancel
                    </button>
                </div>
            </div>
        </div>
                )}

               {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-xl rounded-2xl px-8 py-10 flex items-center gap-3 z-50">
                 <p className="text-gray-800 font-medium text-2xl">{toastMsg}</p>
                </div>
                )}

    </div>
  );
}


