import { DuoCarousels, ReusableCarousel } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";

export default function Home() {

  return (
    <div 
      className="flex flex-col gap-y-20"
    >
      <HomeHero />

      <RandomizeSelection />

      {/* smaller screen */}
      <div className="xxs:flex xxs:flex-col xl:hidden items-center gap-y-20 justify-between text-content mb-10 px-1">
        <RecentlyViewedMealsScroller />
        <DuoCarousels />
      </div>

      {/* bigger screen */}
      <div className="xxs:hidden xl:flex flex-row items-center gap-x-20 justify-between text-content mb-16 px-4">
        <ReusableCarousel title='Dish' />
        <RecentlyViewedMealsScroller />
        <ReusableCarousel title='Cuisine' />
      </div>
    </div>
  )
}