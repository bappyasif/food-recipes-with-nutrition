// import { CarouselVertical } from "@/components/forHome/CarouselVertical";
import { DuoCarousels } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";
import { VerticalCarousel } from "@/components/forHome/VerticalCarousel";
import { Scheduler } from "@/components/forUtilities/bigCalender/tryouts-II/Scheduler";
// import { Scheduler } from "@/components/forUtilities/bigCalender/Scheduler";
import { DragAndDrop } from "@/components/forUtilities/dragAndDrop/DragAndDrop";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[100vh] bg-primary">
      <h1>Home Page</h1>
      <HomeHero />
      <Scheduler />
      <DragAndDrop />
      <RandomizeSelection />
      {/* <Button variant={"ghost"} className="bg-primary-content hover:bg-primary-foreground">Button Here</Button> */}

      {/* <CarouselVertical /> */}

      {/* <VerticalCarousel /> */}

      <div className="flex items-center gap-x-20 justify-center">
        <RecentlyViewedMealsScroller />
        <DuoCarousels />
      </div>
    </div>
  )
}
