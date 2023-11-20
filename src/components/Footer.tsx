import React, { ReactNode } from 'react'
import {TbBrandReact, TbBrandNextjs, TbBrandTypescript, TbBrandRedux, TbBrandPrisma, TbBrandMongodb, TbCalendar, TbBrandUnsplash, TbBrandTailwind, TbBrandOauth, TbSend, TbApi, TbHash} from "react-icons/tb"
import {SiI18Next, SiMinutemailer, SiAxios, SiVercel, SiFramework7} from "react-icons/si"

export const Footer = () => {
  const renderStacks = () => stacks.map(item => <RenderStack key={item.name} {...item} />)

  return (
    <div className='w-full h-[16rem] text-2xl bg-primary-focus text-center flex flex-col gap-y-4'>
      {/* <h2 className='h-20'>Footer</h2> */}
      <h2 className='font-bold text-2xl'>Stack Used</h2>
      <div className='grid grid-cols-4 gap-2 justify-items-center place-content-center'>
        {renderStacks()}
      </div>
    </div>
  )
}

const RenderStack = ({ ...item }: {
  name: string;
  icon: ReactNode | null;
  url?: string
}) => {
  const { icon, name, url } = item

  return (
    <a className='flex gap-x-2 items-center px-2 w-80' title={name} href={url} target='_blank'>
      <span>{name}</span>
      <span>{icon}</span>
    </a>
  )
}

const stacks = [
  { name: "React", icon: <TbBrandReact />, url: "https://react.dev/" }, { name: "NextJs", icon: <TbBrandNextjs />, url: "https://nextjs.org/" },
  { name: "Typescript", icon: <TbBrandTypescript />, url: "https://www.typescriptlang.org/" }, { name: "Redux", icon: <TbBrandRedux />, url: "https://redux.js.org/" },
  { name: "Prisma", icon: <TbBrandPrisma />, url: "https://www.prisma.io/docs/getting-started" }, { name: "MongoDB", icon: <TbBrandMongodb />, url: "https://mongodb.com/" },
  { name: "React Big Calender", icon: <TbCalendar />, url: "https://github.com/jquense/react-big-calendar" }, { name: "axios", icon: <SiAxios />, url: "https://axios-http.com/docs/intro" },

  { name: "i18n", icon: <SiI18Next />, url: "https://www.i18next.com/" }, { name: "i18nexus", icon: <SiI18Next />, url: "https://app.i18nexus.com/" },
  { name: "Resend", icon: <TbSend />, url: "https://resend.com/home" }, { name: "React Email", icon: <TbSend />, url: "https://react.email/docs/introduction" },
  { name: "Nodemailer", icon: <SiMinutemailer />, url: "https://nodemailer.com/" }, { name: "NextAuth - OAuth", icon: <TbBrandOauth />, url: "https://authjs.dev/guides/providers/custom-provider" }, 
  { name: "NextAuth - Credentials", icon: <TbBrandOauth />, url: "https://authjs.dev/guides/providers/credentials" }, { name: "NextAuth - Email", icon: <TbBrandOauth />, url: "https://authjs.dev/guides/providers/email" },

  { name: "Edamam API", icon: <TbApi />, url: "https://www.edamam.com/" }, { name: "The Meal DB API", icon: <TbApi />, url: "https://www.themealdb.com/api.php" },
  { name: "Unsplash", icon: <TbBrandUnsplash />, url: "https://unsplash.com/" }, { name: "Vercel", icon: <SiVercel />, url: "https://vercel.com/" },
  { name: "React Icons", icon: <TbApi />, url: "https://react-icons.github.io/react-icons/" }, { name: "TailwindCss", icon: <TbBrandTailwind />, url: "https://tailwindui.com/" },
  { name: "Shadcn/ui", icon: <SiFramework7 />, url: "https://ui.shadcn.com/" }, { name: "Bcrypt", icon: <TbHash />, url: "https://www.npmjs.com/package/bcrypt" }
]