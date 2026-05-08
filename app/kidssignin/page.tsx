'use client'
import {useState} from "react"

type Kid = {
  id: number;
  firstName: string;
  lastName: string;
};

const kids: Kid[] = [
  { id: 1, firstName: "Yuki", lastName: "Tanaka" },
  { id: 2, firstName: "Hana", lastName: "Sato" },
  { id: 3, firstName: "Kenji", lastName: "Yamamoto" },
  { id: 4, firstName: "Aoi", lastName: "Nakamura" },
  { id: 5, firstName: "Ren", lastName: "Kobayashi" },
];

export default function KidsSignin() {

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "1234"

  const [kidsList, setKidsList] = useState<Kid[]>(kids)
  const [status, setStatus] = useState<Record<number, "in" | "out">>({})
  const [admin, setAdmin] = useState(false)  
  const [editMode, setEditMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalUsername, setModalUsername] = useState("")
  const [modalPassword, setModalPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")



//This is sign in / out for kids
  function handleSignIn(id: number){
    setStatus((prev) => ({...prev, [id]: "in" }))
  }

  function handleSignOut(id: number){
    setStatus((prev) => ({...prev, [id]: "out"}))
  }


  function handleModalSubmit(){
    if (modalUsername === ADMIN_USERNAME &&
        modalPassword === ADMIN_PASSWORD
    ) {setAdmin(true), setEditMode(true), setIsModalOpen(false)}

  }

  function handleRemoveStudent(id:number){
    setKidsList((prev) => prev.filter((kids) => kids.id !== id) )
  }

  function handleAddStudent(){
    setKidsList((prev) => [...prev, {
    id: Date.now(),
    firstName: firstName,
    lastName: lastName
  }])
  setFirstName("")
  setLastName("")
}
 
  function handleAdminSignout(){
    setEditMode(false),
    setAdmin(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Student Sign-In / Sign-Out
      </h1>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {kidsList.map(kid => {
          const s = status[kid.id]
          return (
            <div
              key={kid.id}
              className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100"
            >
              <p className="text-xl font-semibold text-gray-800">
                {kid.lastName} {kid.firstName}
              </p>

              <div className="flex gap-3">
                <button className={`px-5 py-2 rounded-xl text-sm font-semibold
                     ${ s === "in" ? "bg-green-500 text-white" :  "bg-green-100 text-green-700 hover:bg-green-200"}`}
                        onClick={() => handleSignIn(kid.id)}
                        >
                  Sign In
                </button>
                <button 
                    onClick={() => handleSignOut(kid.id)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold
                          ${s === "out" ? "bg-red-400 text-white" : "bg-red-100 text-red-500 hover:bg-red-200"}`}>
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
        <div className="bg-white rounded-2xl mt-20 px-6 py-4 shadow-sm border border-gray-300 flex items-center gap-4 text-black">
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
            <button
                onClick={handleAddStudent}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-400 text-white hover:bg-blue-500">
                Add Student
             </button>
        </div>
)}


        {editMode ? (<button className="px-5 py-2 text-2xl rounded-xl bg-blue-400"
                        onClick={handleAdminSignout}>
                 Admin Logout
        </button>) : (<button className="px-5 py-2 text-2xl rounded-xl bg-blue-400"
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

        
    </div>
  );
}


