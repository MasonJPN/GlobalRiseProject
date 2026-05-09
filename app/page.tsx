import Image from "next/image";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div>
      <main className="bg-[#d2f7fd]">
        <Dashboard/>
      </main>
    </div>
  );
}
