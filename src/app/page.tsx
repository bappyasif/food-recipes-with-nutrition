"use client"
// import { CarouselVertical } from "@/components/forHome/CarouselVertical";
import { SimpleCounter } from "@/components/SimpleCounter";
import { cuisines, dishes } from "@/components/forFilters/FiltersDashboard";
import { DuoCarousels, ReusableCarousel } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";
import { VerticalCarousel } from "@/components/forHome/VerticalCarousel";
import { Scheduler } from "@/components/forUtilities/bigCalender/tryouts-II/Scheduler";
// import { Scheduler } from "@/components/forUtilities/bigCalender/Scheduler";
import { DragAndDrop } from "@/components/forUtilities/dragAndDrop/DragAndDrop";
import { Button } from "@/components/ui/button";

export default function Home() {
  const newDishes = dishes.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?meal=${name.split(" ").join("")}` }))

  const newCuisines = cuisines.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?cuisine=${name.split(" ").join("")}` }))

  return (
    <div className="bg-secondary flex flex-col gap-y-20">
      {/* <h1>Home Page</h1> */}
      {/* <SimpleCounter /> */}
      <HomeHero />

      {/* <Scheduler /> */}

      {/* <DragAndDrop /> */}

      <RandomizeSelection />

      {/* <Button variant={"ghost"} className="bg-primary-content hover:bg-primary-foreground">Button Here</Button> */}

      {/* <CarouselVertical /> */}

      {/* <VerticalCarousel /> */}

      <div className="flex items-center gap-x-20 justify-center text-muted-foreground">
        <ReusableCarousel title='Dishes' items={newDishes} />
        <RecentlyViewedMealsScroller />
        {/* <DuoCarousels /> */}
        <ReusableCarousel title='Cuisines' items={newCuisines} />
      </div>
    </div>
  )
}
