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

  return (
    <div>
      WELCOME TO CHAT APP!

      {userExists === true && <div>
        <button onClick={() => {
          router.push("/dashboard")
        }}>Go to room page</button>
      </div>}

      {userExists === false && <div>
        <button onClick={() => {
          router.push("/signup");
        }}>Dont have your account? Signup</button>
        <button onClick={() => {
          router.push("/signin");
        }}>Have your account? Signin</button>
      </div>}
      
    </div>
  );
}
