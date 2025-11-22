'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /users automatically
    router.push("/users");
  }, [router]);
  return (
    <div className="p-6 text-center">Redirecting to Users Dashboard...</div>
  );
}
