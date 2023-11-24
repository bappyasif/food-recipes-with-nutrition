"use client"

import React from 'react'

import { getProviders, signIn, SessionContext, useSession, getCsrfToken } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from '@/lib/auth'


export default async function SignIn() {
    // const providers = await getAllAuthProviders()

    // const session = useSession()

    // if (session) {
    //     return { redirect: { destination: "/" } }
    // }

    const providers = await getProviders()

    // const {google, email, credentials} = await providers

    // console.log(SessionContext?.Provider, SessionContext, providers)

    // if (!providers) return

    const csrfToken = await getCsrfToken()

    const handleCreds = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const doneSignin = await signIn("credentials", {username: "a@b.com", password: "asdf", redirect: true, callbackUrl: "http://localhost:3000/api/auth/callback/credentials"})
        console.log(doneSignin?.status, "steatyus!!")
        
    }

    const handleEmail = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await signIn("email", {email: "a@b.com"})
    }

    const emailMarkup = (
        <form method="post" action="/api/auth/signin/email" className='flex flex-col gap-y-4' onSubmit={handleEmail}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label className='flex flex-col gap-y-1'>
          Email address
          <input type="email" id="email" name="email" />
        </label>
        <button type="submit">Sign in with Email</button>
      </form>
    )

    const credsMarkup = (
        <form method="post" action="/api/auth/callback/credentials" onSubmit={handleCreds} className='flex flex-col gap-y-4'>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label className='flex flex-col gap-1'>
        Username
        <input name="username" type="text" />
      </label>
      <label className='flex flex-col gap-y-1'>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
    )

    return (
        <div className='flex flex-col gap-y-6 w-full min-h-[100vh] justify-center items-center'>
            {/* custom login page!! */}
            {Object.values(providers!).map((provider) => (
                <div key={provider?.name}>
                    {provider.type === "oauth" ?  <button onClick={() => signIn("google")}>
                        Sign in with {provider.name}
                    </button> : null}
                </div>
            ))}

            {emailMarkup}

            {credsMarkup}
        </div>
    )
}

// export async function getAllAuthProviders() {
//     // const session = await getServerSession(context.req, context.res, nextAuthOptions)

//     // If the user is already logged in, redirect.
//     // Note: Make sure not to redirect to the same page
//     // To avoid an infinite loop!
//     // if (session) {
//     //     return { redirect: { destination: "/" } }
//     // }

//     const providers = await getProviders()

//     return {
//         props: { providers: providers ?? [] },
//     }
// }

// export async function getAllAuthProviders(context: GetServerSidePropsContext) {
//     const session = await getServerSession(context.req, context.res, nextAuthOptions)

//     // If the user is already logged in, redirect.
//     // Note: Make sure not to redirect to the same page
//     // To avoid an infinite loop!
//     if (session) {
//         return { redirect: { destination: "/" } }
//     }

//     const providers = await getProviders()

//     return {
//         props: { providers: providers ?? [] },
//     }
// }