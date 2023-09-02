import Link from 'next/link'
import React from 'react'

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)
  
  return (
    <div className='w-full h-20 text-2xl flex justify-between'>
      <h1>Company Logo!!</h1>
      <nav className='flex gap-x-4'>
        {renderNavs()}
      </nav>
    </div>
  )
}

type NavType = {
  name: string,
  path: string,
  icon: string
}

const RenderNav = ({...item}: NavType) => {
  const {icon, name, path} = item

  return (
    <Link href={path}>
      <span>( {icon} )</span>
      <span>{name}</span>
    </Link>
  )
}

const navs = [
  {name: "Home", path: "/", icon: "HH"},
  {name: "Popular Recipes", path: "/popular-recipes", icon: "PR"},
  {name: "Filter Recipes", path: "/filter-recipes", icon: "FR"}
]