'use client';
import Link from 'next/link';
import {LogOut} from 'lucide-react'
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Clear token from localStorage
    router.push('/auth'); // Redirect to auth page
  };

  return (
    <div className="bg-gray-800 text-white p-4 w-70 min-h-screen rounded-r px-5 flex flex-col justify-between">
        <div >
          <div >
            <h1 className='font-bold text-2xl'>MyApp</h1>
          </div>
          <div className='pt-20 flex gap-3 flex-col'>
            <Link href='/dashboard'><h1 className='hover:text-blue-600'>Dashboard</h1></Link>
            <Link href='/dashboard/profile'><h1 className='hover:text-blue-600'>profile</h1></Link>
            <Link href='/dashboard/settings'><h1 className='hover:text-blue-600'>settings</h1></Link>
          </div>
        </div>
        <button onClick={handleLogout} className='ml-10'>
          <div className='flex gap-2 mb-5'>
            <LogOut className='bottom-0'/>
            <h1 className='bottom-0'>Logout</h1>
          </div>
        </button>
    </div>
  );
}