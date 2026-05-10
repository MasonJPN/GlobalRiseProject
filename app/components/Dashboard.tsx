import Link from "next/link";




export default function Dashboard(){

    return (

        <div className="flex flex-col justify-center items-center gap-10 p-10">

            <div className="flex flex-col gap-10 md:p-10">
                <img src="/GlobalRiseLogo_tp.png" className="h-full w-200"/>
            </div>





            <div className="flex flex-col items-center gap-10 p-10 " >
                <Link href="/kidssignin" className="bg-white h-30 w-110 md:w-200 rounded-3xl flex items-center px-6">
                     <div className="w-15 h-15" /> 
                    <span className="flex-1 text-black text-4xl text-center">KIDS SIGN-IN</span>
                     <img src="/kidsIcon.png" className="  md:w-15 md:h-15" /> 
                </Link>
                
              


                <Link href="/drivers" className="bg-white h-30 w-110 md:w-200 rounded-3xl flex items-center px-6">
                     <div className="w-15 h-15" /> 
                    <span className="flex-1 text-black text-4xl text-center">DRIVERS</span>
                     <img src="/bus.png" className=" w-15 h-15 md:w-20 md:h-20" /> 
                </Link>


                <Link href="/teachersignin" className="bg-white h-30 w-110 md:w-200 rounded-3xl flex items-center px-6">
                     <div className="w-15 h-15" /> 
                    <span className="flex-1 text-black text-4xl text-center">STAFF</span>
                     <img src="/login.png" className=" w-10 h-10 md:w-20 md:h-20" /> 
                </Link>



                
                <button className="bg-white h-30 w-110 md:w-200 text-black text-4xl rounded-3xl">
                    TIME REQUEST
                </button>
            </div>

        </div>
    )
}