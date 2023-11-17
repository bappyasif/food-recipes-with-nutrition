"use client"

import { signupNewCredsUser } from '@/utils/dbRequests';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function CredsUser() {
  const [userData, setUserData] = useState({ username: "", email: "", password: "" })

  const router = useRouter()

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupNewCredsUser(userData).then(resp => {
      // console.log(resp, "response!!")
      router.push(`/api/auth/signin`)
    }).catch(err => console.log(err, "error occured!!"))
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-special-foreground">Signup For Your Account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSignup} className="space-y-6" action="#" method="POST">
          <div className='text-muted-foreground'>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-muted-foreground bg-transparent">User Name</label>
            <div className="mt-2">
              <input id="username" name="username" type="text" autoComplete="username" required className="block w-full rounded-md border-0 py-1.5 text-muted-foreground bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={e => setUserData(prev => ({ ...prev, username: e.target.value }))} placeholder='User name' />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-muted-foreground bg-transparent">Email address</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-muted-foreground bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))} placeholder='User email' />
            </div>
          </div>

          <div className="mt-2">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-muted-foreground bg-transparent">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-muted-foreground bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={e => setUserData(prev => ({ ...prev, password: e.target.value }))} placeholder='User password' />
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-special-foreground px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-special focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Signup</button>
          </div>

        </form>
      </div>
    </div>
  )
}