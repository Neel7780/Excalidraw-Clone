"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserExists(!!token);
  }, []);

  function logoutClick() {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center text-4xl">
      <div className="text-white mr-4">EXCALIDRAW</div>

      {userExists === true && <div>
        <button className="bg-white mt-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={() => {
          router.push("/dashboard")
        }}>Go to room page</button>
        <button className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={logoutClick}>Logout</button>
      </div>}

      {userExists === false && <div>
        <button className="bg-white mt-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={() => {
          router.push("/signup");
        }}>Dont have your account? Signup</button>
        <button className="bg-white mt-8 rounded-2xl p-4 text-xl cursor-pointer m-4" onClick={() => {
          router.push("/signin");
        }}>Have your account? Signin</button>
      </div>}

    </div>
  );
}
