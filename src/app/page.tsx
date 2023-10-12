"use client"

import { cuisines, dishes } from "@/components/forFilters/FiltersDashboard";
import { DuoCarousels, ReusableCarousel } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";

export default function Home() {
  const newDishes = dishes.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?meal=${name.split(" ").join("")}` }))

  const newCuisines = cuisines.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?cuisine=${name.split(" ").join("")}` }))

  return (
    <div className="bg-secondary flex flex-col gap-y-20">
      <HomeHero />

      <RandomizeSelection />

      {/* smaller screen */}
      <div className="xxs:flex xxs:flex-col xl:hidden items-center gap-x-20 justify-center text-muted-foreground">
        <RecentlyViewedMealsScroller />
        <DuoCarousels />
      </div>

      {/* bigger screen */}
      <div className="xxs:hidden xl:flex flex-row items-center gap-x-20 justify-center text-muted-foreground">
        <ReusableCarousel title='Dishes' items={newDishes} />
        <RecentlyViewedMealsScroller />
        <ReusableCarousel title='Cuisines' items={newCuisines} />
      </div>
    </div>
  )
}