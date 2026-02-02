'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-300">
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1>Welcome to 'AppName'</h1>
        <Link href={'/auth'}><Button>Get started!</Button></Link>
      </div>
    </div>
  );
}
