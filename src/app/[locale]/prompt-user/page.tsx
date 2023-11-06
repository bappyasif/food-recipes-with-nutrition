import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: `What's Cooking Yo!! - Login Required`,
  description: "Showing user further instructions about how to access popular rcipes page"
}

const PromptUser = () => {
  return (
    <div className='font-bold text-xl text-muted-foreground w-full text-center min-h-screen mt-20'>
        <h1>Oppsies!! You need to be logged in before viewing this page</h1>
        <h2>You can consider login by clicking on here <Link className='text-special-foreground font-extrabold' href={'/api/auth/signin'}>Login</Link></h2>
    </div>
  )
}

export default PromptUser