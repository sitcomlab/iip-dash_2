"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push('./muenster')

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 pt-24">
    </main>
  );
}
