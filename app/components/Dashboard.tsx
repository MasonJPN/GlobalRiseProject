import Link from "next/link";




export default function Dashboard(){

    return (

        <div className="flex flex-col justify-center items-center gap-10 p-10">

            <div className="flex flex-col gap-10 p-10">
                <img src="/GlobalRiseLogo.png" className="h-full w-200"/>
            </div>





            <div className="flex flex-col gap-10 p-10 " >
                <button className="bg-white h-30 w-200 text-black text-4xl rounded-3xl">
                    <Link href="/kidssignin">
                    KIDS SIGN-IN
                    </Link>
                </button>
                <button className="bg-white h-30 w-200 text-black text-4xl rounded-3xl">
                    DRIVER
                </button>
                <button className="bg-white h-30 w-200 text-black text-4xl rounded-3xl">
                    <Link href="/teachersignin">
                    STAFF SIGN-IN
                    </Link>
                </button>
                <button className="bg-white h-30 w-200 text-black text-4xl rounded-3xl">
                    TIME REQUEST
                </button>
            </div>

        </div>
    )
}